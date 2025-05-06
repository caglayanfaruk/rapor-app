const MSSQLClient = require('../packages/db-clients/mssql-client');
const PostgreSQLClient = require('../packages/db-clients/postgres-client');
const MySQLClient = require('../packages/db-clients/mysql-client');

// MSSQL Örnek Konfigürasyonu
const mssqlConfig = {
    user: 'sa',
    password: 'Q6td99fmq3',
    server: 'DESKTOP-OSU1A4P',
    database: 'LOGODB',
    options: {
        encrypt: true, // Azure kullanıyorsanız
        trustServerCertificate: true // Geliştirme ortamında
    }
};

// PostgreSQL Örnek Konfigürasyonu
const postgresConfig = {
    user: 'kullanici_adi',
    host: 'localhost',
    database: 'veritabani_adi',
    password: 'parola',
    port: 5432,
};

// MySQL Örnek Konfigürasyonu
const mysqlConfig = {
    host: 'localhost',
    user: 'kullanici_adi',
    password: 'parola',
    database: 'veritabani_adi',
    port: 3306
};

async function testDatabaseConnections() {
    // MSSQL Bağlantı Testi
    const mssqlClient = new MSSQLClient(mssqlConfig);
    try {
        await mssqlClient.connect();
        console.log('MSSQL Bağlantısı Başarılı');

        const result = await mssqlClient.query('SELECT GETDATE() as current_time');
        console.log('MSSQL Sunucu Zamanı:', result[0].current_time);
    } catch (err) {
        console.error('MSSQL Bağlantı Hatası:', err);
    } finally {
        await mssqlClient.close();
    }

    // PostgreSQL Bağlantı Testi
    const postgresClient = new PostgreSQLClient(postgresConfig);
    try {
        const client = await postgresClient.connect();
        console.log('PostgreSQL Bağlantısı Başarılı');

        const result = await postgresClient.query('SELECT NOW() as current_time');
        console.log('PostgreSQL Sunucu Zamanı:', result[0].current_time);
    } catch (err) {
        console.error('PostgreSQL Bağlantı Hatası:', err);
    } finally {
        await postgresClient.close();
    }

    // MySQL Bağlantı Testi
    const mysqlClient = new MySQLClient(mysqlConfig);
    try {
        await mysqlClient.connect();
        console.log('MySQL Bağlantısı Başarılı');

        const result = await mysqlClient.query('SELECT NOW() as current_time');
        console.log('MySQL Sunucu Zamanı:', result[0].current_time);
    } catch (err) {
        console.error('MySQL Bağlantı Hatası:', err);
    } finally {
        await mysqlClient.close();
    }
}

// Bağlantıları test et
testDatabaseConnections();
