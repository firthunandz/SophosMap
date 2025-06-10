const pool = require('../database/connection');

const erasController = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, orden FROM eras ORDER BY orden');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al cargar eras:', err);
    res.status(500).json({ error: 'Error al cargar eras' });
  }
}

module.exports = erasController;