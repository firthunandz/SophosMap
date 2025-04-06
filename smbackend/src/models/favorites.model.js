const pool = require('../database/connection');

const favoritesModel = {
  toggle: async (userId, philosopherId) => {
    // Verificar si ya existe
    const existing = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND philosopher_id = $2',
      [userId, philosopherId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND philosopher_id = $2',
        [userId, philosopherId]
      );
      return { isFavorite: false };
    } else {
      await pool.query(
        'INSERT INTO favorites (user_id, philosopher_id) VALUES ($1, $2)',
        [userId, philosopherId]
      );
      return { isFavorite: true };
    }
  },

  getByUser: async (userId) => {
    const result = await pool.query(
      'SELECT philosopher_id FROM favorites WHERE user_id = $1',
      [userId]
    );
    return result.rows.map(row => row.philosopher_id);
  },

  getPhilosophersByUser: async (userId) => {
    const result = await pool.query(
      `SELECT p.* FROM philosophers p
       JOIN favorites f ON p.id = f.philosopher_id
       WHERE f.user_id = $1`,
      [userId]
    );
    return result.rows;
  }
};

module.exports = favoritesModel;