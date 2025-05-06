const MSSQLClient = require('../db-clients/mssql-client');
const PostgreSQLClient = require('../db-clients/postgres-client');
const MySQLClient = require('../db-clients/mysql-client');
const CacheManager = require('../cache-manager');

class ReportEngine {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.cacheManager = new CacheManager();
  }

  // Önceki metodlar aynı kalacak, sadece executeQuery metodunu güncelleyeceğiz
  async executeQuery(query, params = {}, options = {}) {
    const { useCache = true, cacheTTL = 3600 } = options;

    if (!this.client) {
      await this.initializeClient();
    }

    // Önbellekten kontrol et
    const cacheKey = this.generateCacheKey(query, params);
    if (useCache) {
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }

    try {
      const sanitizedQuery = this.sanitizeQuery(query);
      const result = await this.client.query(sanitizedQuery, params);
      
      const processedResult = {
        data: result,
        queryTime: new Date(),
        rowCount: result.length
      };

      // Önbelleğe kaydet
      if (useCache) {
        await this.cacheManager.set(cacheKey, processedResult, cacheTTL);
      }

      return processedResult;
    } catch (error) {
      console.error('Rapor sorgusu hatası:', error);
      throw error;
    }
  }

  // Önbellek anahtarı oluştur
  generateCacheKey(query, params) {
    const paramsString = JSON.stringify(params);
    return `report:${this.hashCode(query)}:${this.hashCode(paramsString)}`;
  }

  // Basit hash fonksiyonu
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32-bit integer'a çevir
    }
    return Math.abs(hash);
  }

  // Diğer metodlar aynı kalacak
}

module.exports = ReportEngine;
