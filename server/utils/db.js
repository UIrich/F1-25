require('dotenv').config();

const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,        // 'sa'
    password: process.env.DB_PASSWORD, // '123'
    server: process.env.DB_SERVER,    // 'localhost'
    database: process.env.DB_DATABASE, // 'F1-25'
    port: parseInt(process.env.DB_PORT), // 1433
    options: {
      encrypt: false,
      trustServerCertificate: true // Necessário para conexões locais
    }
  };

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Conectado ao SQL Server!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao SQL Server:', err);
    });

module.exports = {
    sql,
    poolPromise
};
