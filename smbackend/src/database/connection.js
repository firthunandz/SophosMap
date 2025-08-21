const dns = require('dns');

try {
  dns.setDefaultResultOrder && dns.setDefaultResultOrder('ipv4first');
} catch (e) {
}

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  lookup: (hostname, _opts, cb) => dns.lookup(hostname, { family: 4, all: false }, cb),

});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};