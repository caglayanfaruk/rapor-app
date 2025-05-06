const { Pool } = require('pg');

class PostgreSQLClient {
    constructor(config) {
        this.config = config;
        this.pool = new Pool(this.config);

        // Hata dinleyicisi
        this.pool.on('error', (err) => {
            console.error('PostgreSQL havuz hatası:', err);
        });
    }

    async connect() {
        try {
            const client = await this.pool.connect();
            console.log('PostgreSQL bağlantısı başarıyla kuruldu.');
            return client;
        } catch (err) {
            console.error('PostgreSQL bağlantı hatası:', err);
            throw err;
        }
    }

    async query(queryString, params = []) {
        const client = await this.connect();
        try {
            const result = await client.query(queryString, params);
            client.release();
            return result.rows;
        } catch (err) {
            client.release();
            console.error('Sorgu hatası:', err);
            throw err;
        }
    }

    async close() {
        try {
            await this.pool.end();
            console.log('PostgreSQL bağlantısı kapatıldı.');
        } catch (err) {
            console.error('Bağlantı kapatma hatası:', err);
        }
    }
}

module.exports = PostgreSQLClient;
