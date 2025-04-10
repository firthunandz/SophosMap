const pool = require('../database/connection');

const getPhilosophers = async ({ era, school, name } = {}) => {
  let query = `
    SELECT p.id, p.nombre, p.fecha_nacimiento, e.nombre AS era
    FROM philosophers p
    LEFT JOIN eras e ON p.era_id = e.id
    WHERE 1=1
  `;
  const values = [];

  if (era) {
    values.push(era);
    query += ` AND e.nombre = $${values.length}`;
  }

  if (school) {
    values.push(school);
    query += ` AND es.nombre = $${values.length}`;
  }

  if (name) {
    values.push(`%${name}%`);
    query += ` AND p.nombre ILIKE $${values.length}`;
  }

  query += ` ORDER BY p.id ASC`;

  const res = await pool.query(query, values);
  return res.rows;
};

const getPhilosopherById = async (id) => {
  const baseQuery = `
    SELECT 
      p.*, 
      e.nombre AS era,
      es.nombre AS escuela,
      r.nombre AS religion
    FROM philosophers p
    LEFT JOIN eras e ON p.era_id = e.id
    LEFT JOIN schools es ON p.escuela_id = es.id
    LEFT JOIN religions r ON p.religion_id = r.id
    WHERE p.id = $1
  `;
  const { rows } = await pool.query(baseQuery, [id]);
  const philosopher = rows[0];
  if (!philosopher) return null;

  const related = {
    ocupacion: "SELECT ocupacion FROM occupations WHERE philosopher_id = $1",
    intereses: "SELECT interest FROM interests WHERE philosopher_id = $1",
    conceptos: "SELECT concepto FROM concepts WHERE philosopher_id = $1",
    influencias: "SELECT influencia FROM influences WHERE philosopher_id = $1",
    alumnos: "SELECT student_name FROM students WHERE philosopher_id = $1",
    maestros: "SELECT teacher_name FROM teachers WHERE philosopher_id = $1",
    legado: "SELECT legado FROM legacies WHERE philosopher_id = $1",
    citas: "SELECT cita FROM quotes WHERE philosopher_id = $1",
    libros: "SELECT titulo, descripcion, idioma, estado FROM books WHERE philosopher_id = $1",
    obras: "SELECT titulo, descripcion FROM works WHERE philosopher_id = $1"
  };

  for (const [key, sql] of Object.entries(related)) {
    const res = await pool.query(sql, [id]);
    if (key === 'libros' || key === 'obras') {
      philosopher[key] = res.rows;
    } else if (key === 'citas') {
      philosopher[key] = res.rows.map(r => r.cita);
    } else {
      philosopher[key] = res.rows.map(r => Object.values(r)[0]);
    }
  }

  return philosopher;
}

module.exports = {
  getPhilosophers,
  getPhilosopherById,
};