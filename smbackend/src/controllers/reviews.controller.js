const db = require('../database/connection');

const createReview = async (req, res) => {
  const { text, name } = req.body;
  const userId = req.user?.id || null;

  try {
    if (!text || (!userId && !name)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const result = await db.query(
      'INSERT INTO reviews (user_id, name, text) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando review:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.id, r.text, r.created_at, 
              u.username AS user_name,
              r.name AS guest_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    const reviews = result.rows.map(r => ({
      id: r.id,
      text: r.text,
      created_at: r.created_at,
      name: r.user_name || r.guest_name,
    }));

    res.json(reviews);
  } catch (error) {
    console.error('Error trayendo reviews:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createReview,
  getAllReviews
}