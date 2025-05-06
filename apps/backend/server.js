const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');

// Ortam değişkenlerini yükle
dotenv.config({ path: '../../config/env/env.dev' });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL'si
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Temel hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Bir hata oluştu',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Yakalanmamış promise reddini yakala
process.on('unhandledRejection', (reason, promise) => {
  console.error('Yakalanmamış Promise Reddi:', reason);
});
