const philosopherModel = require('../models/philosopher.model');
const pool = require('../database/connection');

const getAllPhilosophers = async (req, res) => {
  const { era, school, search } = req.query;
  try {
    const philosophers = await philosopherModel.modelGetPhilosophers({ 
      era, 
      school, 
      name: search 
    });
    res.json(philosophers);
    
  } catch (err) {
    console.error('Error al obtener filósofos:', err);
    res.status(500).json({ error: 'Error al obtener filósofos' });
  }
}

const getPhilosopherById = async (req, res) => {
  try {
    const philosopher = await philosopherModel.modelGetPhilosopherById(req.params.id);
    if (!philosopher) {
      return res.status(404).json({ error: 'Filósofo no encontrado' });
    }
    res.json(philosopher);
  } catch (err) {
    console.error('Error al obtener filósofo:', err);
    res.status(500).json({ error: 'Error al obtener el filósofo' });
  }
};

const searchPhilosophers = async (req, res) => {
  const { q = '', eras, religions, schools } = req.query;
  try {
    const philosophers = await philosopherModel.modelSearchPhilosophers({
      q,
      eras,
      religions,
      schools
    });
    res.json(philosophers);
  } catch (err) {
    console.error('Error en búsqueda de filósofos:', err);
    res.status(500).json({ error: 'Error al buscar filósofos' });
  }
};

const getPhilosophersByEra = async (req, res) => {
  const { q = '', eras } = req.query;
  console.log('Req.query: '+ req.query); //debug2
  try {
    const philosophers = await philosopherModel.modelGetPhilosophersByEra(q, eras);
    res.json(philosophers);
  } catch (err) {
    console.error("Error al obtener filósofos:", err);
    res.status(500).json({ error: "Error al obtener filósofos" });
  }
};

module.exports = {
  getAllPhilosophers,
  getPhilosopherById,
  searchPhilosophers,
  getPhilosophersByEra
}

    // const {
    //   q = '',
    //   era,
    //   escuela,
    //   religion,
    // } = req.query;
  
    // try {
    //   let queryText = `
    //     SELECT DISTINCT ON (p.id) p.*, e.nombre AS era, s.nombre AS escuela
    //     FROM philosophers p
    //     LEFT JOIN eras e ON p.era_id = e.id
    //     LEFT JOIN schools s ON p.escuela_id = s.id
    //     LEFT JOIN religions r ON p.religion_id = r.id
    //     LEFT JOIN occupations o ON o.philosopher_id = p.id
    //     LEFT JOIN concepts c ON c.philosopher_id = p.id
    //   `;
  
    //   const values = [];
  
    //   if (q) {
    //     values.push(`%${q}%`);
    //     queryText += `
    //       AND (
    //         unaccent(LOWER(p.nombre)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(p.lugar_nacimiento)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(p.lugar_muerte)) LIKE unaccent(LOWER($${values.length}))
    //         OR CAST(p.fecha_nacimiento AS TEXT) LIKE $${values.length}
    //         OR CAST(p.fecha_muerte AS TEXT) LIKE $${values.length}
    //         OR unaccent(LOWER(e.nombre)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(s.nombre)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(r.nombre)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(o.ocupacion)) LIKE unaccent(LOWER($${values.length}))
    //         OR unaccent(LOWER(c.concepto)) LIKE unaccent(LOWER($${values.length}))
    //       )
    //     `;
    //   }
      
    //   if (era) {
    //     values.push(era);
    //     queryText += ` AND e.nombre = $${values.length}`;
    //   }
      
    //   if (escuela) {
    //     values.push(escuela);
    //     queryText += ` AND s.nombre = $${values.length}`;
    //   }
      
    //   if (religion) {
    //     values.push(religion);
    //     queryText += ` AND r.nombre = $${values.length}`;
    //   }