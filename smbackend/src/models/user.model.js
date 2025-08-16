const { query } = require('../database/connection');

const getUserByUsername = async (username) => {
  const res = await query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

const createUser = async (userData) => {
  const { nickname, username, email, passwordHash } = userData;
  const res = await query(
    `INSERT INTO users (nickname, username, email, password_hash)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nickname, username, email, passwordHash]
  );
  return res.rows[0];
};

const getUserById = async (id) => {
  try {
    const userResult = await query(
      `SELECT id, username, nickname FROM users WHERE id = $1`, 
      [id]
    );
    if (userResult.rows.length === 0) return null;

    const user = userResult.rows[0];

    const favoritesResult = await query(
      `SELECT 
        p.id, 
        p.nombre, 
        p.fecha_nacimiento, 
        e.nombre AS era
      FROM favorites f
      JOIN philosophers p ON f.philosopher_id = p.id
      LEFT JOIN eras e ON p.era_id = e.id
      WHERE f.user_id = $1`,
      [id]
    );

    user.favorites = favoritesResult.rows;
    return user;

  } catch (error) {
    console.error('[getUserById] Error:', error);
    throw error;
  }
};

module.exports = {
  getUserByUsername,
  createUser,
  getUserById
};