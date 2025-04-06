const pool = require('../database/connection');

const timeline = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM philosophers ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener filósofos:", error);
    res.status(500).json({ error: "Error al obtener filósofos" });
  }
};

module.exports = timeline;