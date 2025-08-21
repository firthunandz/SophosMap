const dns = require('dns');

const { Pool } = require('pg');
require('dotenv').config();

const forceIPv4Lookup = (hostname, opts, cb) => {
  dns.lookup(hostname, { family: 4, all: false }, cb);
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  lookup: forceIPv4Lookup,
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};