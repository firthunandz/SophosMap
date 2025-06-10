const pool = require('../database/connection');

const schoolsController = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM schools ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al cargar schools:', err);
    res.status(500).json({ error: 'Error al cargar schools' });
  }
};

module.exports = schoolsController;