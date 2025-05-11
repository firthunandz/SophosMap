const pool = require('../database/connection');

const modelGetPhilosophers = async ({ era, school, name } = {}) => {
  let query = `
    SELECT
      p.id,
      p.nombre,
      p.fecha_nacimiento,
      p.fecha_texto,
      e.nombre AS era
    FROM philosophers p
    LEFT JOIN eras    e  ON p.era_id       = e.id
    LEFT JOIN schools es ON p.escuela_id   = es.id
    LEFT JOIN religions r ON p.religion_id = r.id
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

  query += ` ORDER BY p.fecha_nacimiento ASC NULLS LAST`;

  const res = await pool.query(query, values);
  return res.rows;
};

const modelSearchPhilosophers = async ({ q, eras, religions, schools }) => {
  let query = `
    SELECT DISTINCT ON (p.id) p.*, e.nombre AS era, r.nombre AS religion, s.nombre AS escuela
    FROM philosophers p
    LEFT JOIN eras e ON p.era_id = e.id
    LEFT JOIN schools s ON p.escuela_id = s.id
    LEFT JOIN religions r ON p.religion_id = r.id
    LEFT JOIN concepts c ON c.philosopher_id = p.id
    WHERE 1=1
  `;
  const values = [];

  // Si hay texto de búsqueda (q), añadimos el filtro
  if (q) {
    values.push(`%${q}%`);
    query += `
      AND (
        unaccent(LOWER(p.nombre)) LIKE unaccent(LOWER($${values.length}))
        OR unaccent(LOWER(p.lugar_nacimiento)) LIKE unaccent(LOWER($${values.length}))
        OR unaccent(LOWER(p.lugar_muerte)) LIKE unaccent(LOWER($${values.length}))
        OR CAST(p.fecha_nacimiento AS TEXT) LIKE $${values.length}
        OR CAST(p.fecha_muerte AS TEXT) LIKE $${values.length}
        OR unaccent(LOWER(e.nombre)) LIKE unaccent(LOWER($${values.length}))
        OR unaccent(LOWER(s.nombre)) LIKE unaccent(LOWER($${values.length}))
        OR unaccent(LOWER(r.nombre)) LIKE unaccent(LOWER($${values.length}))
        OR unaccent(LOWER(c.concepto)) LIKE unaccent(LOWER($${values.length}))
      )
    `;
  }

  // Si hay eras, añadir filtro por era
  if (eras) {
    const erasArray = eras.split(",");
    query += ` AND e.nombre IN (${erasArray.map((_, idx) => `$${values.length + idx + 1}`).join(",")})`;
    values.push(...erasArray);
  }

  // Si hay religiones, añadir filtro por religión
  if (religions) {
    const religionsArray = religions.split(",");
    query += ` AND r.nombre IN (${religionsArray.map((_, idx) => `$${values.length + idx + 1}`).join(",")})`;
    values.push(...religionsArray);
  }

  // Si hay escuelas, añadir filtro por escuela
  if (schools) {
    const schoolsArray = schools.split(",");
    query += ` AND s.nombre IN (${schoolsArray.map((_, idx) => `$${values.length + idx + 1}`).join(",")})`;
    values.push(...schoolsArray);
  }

  // Asegurarse de que el ORDER BY sea por id primero
  query += ` ORDER BY p.id, p.fecha_nacimiento ASC NULLS LAST`;  // Primero ordenar por id y luego por fecha de nacimiento

  const res = await pool.query(query, values);
  return res.rows;
};

const modelGetPhilosopherById = async (id) => {
  const baseQuery = `
    SELECT 
      p.*,
      p.fecha_texto,
      e.nombre   AS era,
      es.nombre  AS escuela,
      r.nombre   AS religion
    FROM philosophers p
    LEFT JOIN eras      e ON p.era_id       = e.id
    LEFT JOIN schools   es ON p.escuela_id   = es.id
    LEFT JOIN religions r ON p.religion_id   = r.id
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
  modelGetPhilosophers,
  modelSearchPhilosophers,
  modelGetPhilosopherById,
};