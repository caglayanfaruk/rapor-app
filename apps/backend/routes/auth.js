const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Kullanıcı veritabanı (geçici olarak sabit kullanıcılar)
const users = [
  {
    id: 1,
    username: 'admin',
    // plaintext: admin123
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    // plaintext: user123
    password: bcrypt.hashSync('user123', 10),
    role: 'user'
  }
];

// JWT için gizli anahtar
const JWT_SECRET = process.env.JWT_SECRET || 'varsayilan_gizli_anahtar';

// Token üretme fonksiyonu
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

// Token doğrulama middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Token gerekli' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Giriş rotası
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kullanıcıyı bul
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz şifre' });
    }

    // Token oluştur
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Profil bilgileri rotası
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Rol bazlı yetkilendirme middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    }

    next();
  };
};

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.checkRole = checkRole;
