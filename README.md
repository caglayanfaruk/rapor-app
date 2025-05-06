<<<<<<< HEAD
# rapor-app
# rapor-app
=======
# Rapor Yönetim Sistemi

## Proje Açıklaması
Node.js, Next.js ve Express.js kullanılarak geliştirilmiş kapsamlı bir rapor yönetim sistemi.

## Özellikler
- Kullanıcı Yönetimi
- Rol Bazlı Erişim Kontrolü
- Dinamik Rapor Oluşturma
- Redis Önbellek Entegrasyonu

## Gereksinimler
- Node.js (v18+)
- npm
- Redis (Opsiyonel)

## Kurulum
1. Depoyu klonlayın
```bash
git clone https://github.com/kullanici-adi/rapor-app.git
cd rapor-app
```

2. Bağımlılıkları yükleyin
```bash
npm install
```

3. Ortam değişkenlerini yapılandırın
- `config/env/env.dev` dosyasını düzenleyin

4. Uygulamayı başlatın
```bash
# Frontend
cd apps/frontend
npm run dev

# Backend (ayrı bir terminalde)
cd ../backend
npm start
```

## Kullanım
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Katkıda Bulunma
1. Fork yapın
2. Yeni özellik dalı oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Merge talebi açın

## Lisans
[Lisans Bilgisi Eklenecek]
>>>>>>> 0118f0b (Proje ilk yükleme: Rapor Yönetim Sistemi temel yapısı)
