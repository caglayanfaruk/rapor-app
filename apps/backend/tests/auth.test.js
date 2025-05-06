const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

describe('Kimlik Doğrulama Testleri', () => {
  // Başarılı Giriş Testi
  it('Geçerli kullanıcı girişi yapılmalı', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe('admin');
  });

  // Başarısız Giriş Testleri
  it('Geçersiz kullanıcı adı ile giriş yapılamamalı', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'invalid_user',
        password: 'password123'
      });

    expect(response.statusCode).toBe(401);
  });

  it('Yanlış şifre ile giriş yapılamamalı', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrong_password'
      });

    expect(response.statusCode).toBe(401);
  });
});
