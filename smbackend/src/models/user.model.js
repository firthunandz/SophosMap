const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Funciones básicas de usuario
const getUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

const createUser = async (userData) => {
  const { nickname, username, email, passwordHash } = userData;
  const res = await pool.query(
    `INSERT INTO users (nickname, username, email, password_hash)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nickname, username, email, passwordHash]
  );
  return res.rows[0];
};

// Funciones para favoritos
const addFavorite = async (userId, philosopherName) => {
  await pool.query(
    `INSERT INTO user_favorites (user_id, philosopher_name)
     VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, philosopherName]
  );
};

const getFavorites = async (userId) => {
  const res = await pool.query(
    'SELECT philosopher_name FROM user_favorites WHERE user_id = $1',
    [userId]
  );
  return res.rows.map(row => row.philosopher_name);
};

module.exports = {
  getUserByUsername,
  createUser,
  addFavorite,
  getFavorites
};