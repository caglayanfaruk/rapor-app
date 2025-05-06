const sql = require('mssql');

class MSSQLClient {
    constructor(config) {
        this.config = config;
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = await sql.connect(this.config);
            console.log('MSSQL bağlantısı başarıyla kuruldu.');
            return this.pool;
        } catch (err) {
            console.error('MSSQL bağlantı hatası:', err);
            throw err;
        }
    }

    async query(queryString, params = {}) {
        try {
            if (!this.pool) await this.connect();
            const request = this.pool.request();
            
            // Parametreleri ekle
            Object.keys(params).forEach(key => {
                request.input(key, params[key]);
            });

            const result = await request.query(queryString);
            return result.recordset;
        } catch (err) {
            console.error('Sorgu hatası:', err);
            throw err;
        }
    }

    async close() {
        try {
            if (this.pool) {
                await this.pool.close();
                console.log('MSSQL bağlantısı kapatıldı.');
            }
        } catch (err) {
            console.error('Bağlantı kapatma hatası:', err);
        }
    }
}

module.exports = MSSQLClient;
