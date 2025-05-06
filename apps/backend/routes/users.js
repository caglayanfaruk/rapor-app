const express = require('express');
const { verifyToken, checkRole } = require('./auth');
const UserModel = require('../../../packages/user-management/user-model');

const router = express.Router();
const userModel = new UserModel();

// Kullanıcı oluşturma (sadece admin)
router.post('/', verifyToken, checkRole(['admin']), (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body;

    // Kullanıcı adı ve email kontrolü
    if (userModel.users.some(u => u.username === username)) {
      return res.status(400).json({ message: 'Kullanıcı adı zaten kullanımda' });
    }

    if (userModel.users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'E-posta zaten kullanımda' });
    }

    const newUser = userModel.createUser({
      username,
      email,
      password,
      role: role || 'user',
      permissions: permissions || ['view_report']
    });

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu', error: error.message });
  }
});

// Kullanıcıları listeleme (sadece admin)
router.get('/', verifyToken, checkRole(['admin']), (req, res) => {
  try {
    const users = userModel.listUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar listelenirken hata oluştu', error: error.message });
  }
});

// Kullanıcı güncelleme (admin veya kendi profilini güncelleyen kullanıcı)
router.put('/:id', verifyToken, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, password, role, permissions, active } = req.body;

    // Yetki kontrolü
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Bu işlemi gerçekleştirme yetkiniz yok' });
    }

    // Kullanıcı adı ve email benzersizlik kontrolü
    if (username && userModel.users.some(u => u.username === username && u.id !== userId)) {
      return res.status(400).json({ message: 'Kullanıcı adı zaten kullanımda' });
    }

    if (email && userModel.users.some(u => u.email === email && u.id !== userId)) {
      return res.status(400).json({ message: 'E-posta zaten kullanımda' });
    }

    // Sadece admin rol ve izinleri değiştirebilir
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    
    if (req.user.role === 'admin') {
      if (role) updateData.role = role;
      if (permissions) updateData.permissions = permissions;
      if (active !== undefined) updateData.active = active;
    }

    const updatedUser = userModel.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      message: 'Kullanıcı güncellendi',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı güncellenirken hata oluştu', error: error.message });
  }
});

// Kullanıcı silme (sadece admin)
router.delete('/:id', verifyToken, checkRole(['admin']), (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Admin kullanıcısını silmeyi engelle
    if (userId === 1) {
      return res.status(400).json({ message: 'Ana admin kullanıcısı silinemez' });
    }

    const deleted = userModel.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu', error: error.message });
  }
});

module.exports = router;
