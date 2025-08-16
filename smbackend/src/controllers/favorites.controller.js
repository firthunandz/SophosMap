const pool = require('../database/connection');

const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
        p.id, 
        p.nombre, 
        p.fecha_nacimiento, 
        e.nombre AS era
      FROM favorites f
      JOIN philosophers p ON f.philosopher_id = p.id
      LEFT JOIN eras e ON p.era_id = e.id
      WHERE f.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('[getFavorites] Error:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

const addFavorite = async (req, res) => {
  const { philosopherId } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: 'No autorizado. Iniciá sesión.' });
  }

  try {
    await pool.query(
      `INSERT INTO favorites (user_id, philosopher_id) 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, philosopherId]
    );
    res.json({ message: 'Filósofo agregado a favoritos' });

  } catch (error) {
    console.error('[addFavorite] Error:', error);
    res.status(500).json({ error: 'Error al agregar a favoritos' });
  }
};

const removeFavorite = async (req, res) => {
  const { philosopherId } = req.params;
  const userId = req.user.id;

  try {
    await pool.query(
      `DELETE FROM favorites WHERE user_id = $1 AND philosopher_id = $2`,
      [userId, philosopherId]
    );
    res.json({ message: 'Filósofo eliminado de favoritos' });

  } catch (error) {
    console.error('[removeFavorite] Error:', error);
    res.status(500).json({ error: 'Error al eliminar de favoritos' });
  }
};


module.exports = { 
  getFavorites,
  addFavorite,
  removeFavorite
};
