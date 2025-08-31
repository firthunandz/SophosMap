const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  }
   else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};