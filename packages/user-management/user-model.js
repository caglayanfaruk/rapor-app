const bcrypt = require('bcryptjs');

class UserModel {
  constructor(database) {
    this.database = database;
    this.users = [];
    this.initializeDefaultUsers();
  }

  // Varsayılan kullanıcıları başlat
  initializeDefaultUsers() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@raporsistemi.com',
        password: this.hashPassword('admin123'),
        role: 'admin',
        permissions: ['create_report', 'edit_report', 'delete_report', 'manage_users'],
        active: true,
        createdAt: new Date(),
        lastLogin: null
      },
      {
        id: 2,
        username: 'user',
        email: 'user@raporsistemi.com',
        password: this.hashPassword('user123'),
        role: 'user',
        permissions: ['view_report'],
        active: true,
        createdAt: new Date(),
        lastLogin: null
      }
    ];
  }

  // Şifre hashleme
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Kullanıcı oluşturma
  createUser(userData) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
      password: this.hashPassword(userData.password),
      createdAt: new Date(),
      active: true,
      lastLogin: null
    };

    this.users.push(newUser);
    return newUser;
  }

  // Kullanıcı doğrulama
  authenticateUser(username, password) {
    const user = this.users.find(u => u.username === username);
    
    if (!user || !user.active) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (isPasswordValid) {
      user.lastLogin = new Date();
      return user;
    }

    return null;
  }

  // Kullanıcı bulma
  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Kullanıcı güncelleme
  updateUser(id, updateData) {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    // Şifre güncellemesi varsa hash'le
    if (updateData.password) {
      updateData.password = this.hashPassword(updateData.password);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData
    };

    return this.users[userIndex];
  }

  // Kullanıcı silme
  deleteUser(id) {
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  // Tüm kullanıcıları listeleme
  listUsers() {
    // Hassas bilgileri çıkar
    return this.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
  }

  // Kullanıcı izinlerini kontrol etme
  checkPermission(userId, requiredPermission) {
    const user = this.findUserById(userId);
    
    if (!user) {
      return false;
    }

    return user.permissions.includes(requiredPermission);
  }
}

module.exports = UserModel;
