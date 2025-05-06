const Redis = require('ioredis');

class CacheManager {
  constructor(config = {}) {
    this.redis = new Redis({
      host: config.host || 'localhost',
      port: config.port || 6379,
      password: config.password || null
    });

    this.defaultTTL = config.defaultTTL || 3600; // Varsayılan 1 saat
  }

  // Veriyi önbelleğe kaydet
  async set(key, value, ttl = this.defaultTTL) {
    try {
      // JSON'a çevir
      const serializedValue = JSON.stringify(value);
      await this.redis.set(key, serializedValue, 'EX', ttl);
      return true;
    } catch (error) {
      console.error('Önbelleğe kaydetme hatası:', error);
      return false;
    }
  }

  // Önbellekten veri al
  async get(key) {
    try {
      const cachedValue = await this.redis.get(key);
      return cachedValue ? JSON.parse(cachedValue) : null;
    } catch (error) {
      console.error('Önbellekten alma hatası:', error);
      return null;
    }
  }

  // Önbellekten silme
  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Önbellekten silme hatası:', error);
      return false;
    }
  }

  // Tüm önbelleği temizle
  async clear() {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      console.error('Önbellek temizleme hatası:', error);
      return false;
    }
  }

  // Bağlantıyı kapat
  async close() {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Redis bağlantısı kapatma hatası:', error);
    }
  }
}

module.exports = CacheManager;
