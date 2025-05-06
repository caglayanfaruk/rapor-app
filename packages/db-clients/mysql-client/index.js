const mysql = require('mysql2/promise');

class MySQLClient {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = await mysql.createPool(this.config);
            console.log('MySQL bağlantı havuzu oluşturuldu.');
            return this.pool;
        } catch (err) {
            console.error('MySQL bağlantı hatası:', err);
            throw err;
        }
    }

    async query(queryString, params = []) {
        try {
            if (!this.pool) await this.connect();
            
            const [rows] = await this.pool.execute(queryString, params);
            return rows;
        } catch (err) {
            console.error('Sorgu hatası:', err);
            throw err;
        }
    }

    async close() {
        try {
            if (this.pool) {
                await this.pool.end();
                console.log('MySQL bağlantısı kapatıldı.');
            }
        } catch (err) {
            console.error('Bağlantı kapatma hatası:', err);
        }
    }
}

module.exports = MySQLClient;
