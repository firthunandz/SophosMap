const pool = require('../database/connection');

const religionController = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM religions ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al cargar religions:', err);
    res.status(500).json({ error: 'Error al cargar religions' });
  }
}

module.exports = religionController;