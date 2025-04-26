const pool = require('../database/connection');

const timeline = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM philosophers ORDER BY fecha_nacimiento ASC NULLS LAST");
    res.json(result.rows);
  } catch (error) {
    console.error("Error SQL al obtener filósofos:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: error.message });
  }
};

module.exports = timeline;