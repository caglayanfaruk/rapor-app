const express = require('express');
const { verifyToken, checkRole } = require('./auth');
const ReportEngine = require('../../../packages/report-engine');

const router = express.Router();

// Örnek rapor tanımları
const reportTemplates = [
  {
    id: 1,
    title: 'Aylık Satış Raporu',
    description: 'Aylık toplam satış ve kategori bazında dağılım',
    query: `
      SELECT 
        DATEPART(MONTH, satis_tarihi) as ay,
        SUM(tutar) as toplam_satis,
        kategori
      FROM satislar
      GROUP BY DATEPART(MONTH, satis_tarihi), kategori
    `,
    accessRoles: ['admin', 'user']
  },
  {
    id: 2,
    title: 'Personel Performans Raporu',
    description: 'Çalışanların aylık satış performansı',
    query: `
      SELECT 
        personel_adi,
        COUNT(satis_id) as satis_adedi,
        SUM(tutar) as toplam_satis
      FROM satislar
      GROUP BY personel_adi
      ORDER BY toplam_satis DESC
    `,
    accessRoles: ['admin']
  }
];

// Veritabanı konfigürasyonu (gerçek proje için env dosyasından alınacak)
const databaseConfig = {
  type: 'mssql',
  host: 'localhost',
  user: 'kullanici_adi',
  password: 'parola',
  database: 'rapor_veritabani'
};

// Tüm raporları listeleme
router.get('/', verifyToken, (req, res) => {
  // Kullanıcının rolüne göre erişebileceği raporları filtrele
  const userReports = reportTemplates.filter(report => 
    report.accessRoles.includes(req.user.role)
  );

  res.json(userReports);
});

// Belirli bir raporu çalıştırma
router.post('/:id/run', verifyToken, async (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const report = reportTemplates.find(r => r.id === reportId);

    if (!report) {
      return res.status(404).json({ message: 'Rapor bulunamadı' });
    }

    // Rol kontrolü
    if (!report.accessRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bu rapora erişim izniniz yok' });
    }

    // Rapor motorunu başlat
    const reportEngine = new ReportEngine(databaseConfig);
    
    // Raporu çalıştır
    const result = await reportEngine.executeQuery(report.query);
    
    // Raporu önbelleğe al
    await reportEngine.cacheReport(reportId, result);
    
    // Bağlantıyı kapat
    await reportEngine.close();

    res.json({
      report,
      ...result
    });
  } catch (error) {
    console.error('Rapor çalıştırma hatası:', error);
    res.status(500).json({ 
      message: 'Rapor oluşturulurken hata oluştu', 
      error: error.message 
    });
  }
});

// Rapor şablonu oluşturma (sadece admin)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const reportEngine = new ReportEngine(databaseConfig);
    
    const newReportTemplate = await reportEngine.createReportTemplate(req.body);
    
    reportTemplates.push(newReportTemplate);
    
    res.status(201).json(newReportTemplate);
  } catch (error) {
    res.status(500).json({ 
      message: 'Rapor şablonu oluşturulurken hata oluştu', 
      error: error.message 
    });
  }
});

module.exports = router;
