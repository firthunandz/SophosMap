const philosopherModel = require('../models/philosopher.model');
const { pool } = require('../database/connection');

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
  const { id } = req.params;
  const startTime = Date.now();
  const client = await pool.connect();

  try {
    const philoRes = await client.query(
      `
      SELECT 
        p.id,
        p.nombre,
        p.fecha_nacimiento,
        p.fecha_texto,
        p.era_id,
        p.escuela_id,
        p.religion_id,
        p.image_url,
        p.lugar_nacimiento,
        p.fecha_muerte,
        p.lugar_muerte,
        e.nombre   AS era,
        es.nombre  AS escuela,
        r.nombre   AS religion,
        p.notas
      FROM philosophers p
      LEFT JOIN eras    e  ON p.era_id      = e.id
      LEFT JOIN schools es ON p.escuela_id  = es.id
      LEFT JOIN religions r ON p.religion_id = r.id
      WHERE p.id = $1
      `,
      [id]
    );
    if (philoRes.rows.length === 0) {
      return res.status(404).json({ error: 'Filósofo no encontrado' });
    }
    const philosopher = philoRes.rows[0];

    const fetchTextArray = async (tableName, columnName) => {
      const result = await client.query(
        `SELECT ${columnName} FROM ${tableName} WHERE philosopher_id = $1`,
        [id]
      );
      return result.rows.map(r => r[columnName]);
    };

    philosopher.legado     = await fetchTextArray('legacies',     'legado');
    philosopher.ocupacion  = await fetchTextArray('occupations',  'ocupacion');
    philosopher.intereses  = await fetchTextArray('interests',    'interest');
    philosopher.conceptos  = await fetchTextArray('concepts',     'concepto');
    philosopher.influencias= await fetchTextArray('influences',   'influencia');
    philosopher.estudiantes= await fetchTextArray('students',     'student_name');
    philosopher.maestros   = await fetchTextArray('teachers',     'teacher_name');

    const booksRes = await client.query(
      `
      SELECT titulo, idioma, estado, descripcion
      FROM books
      WHERE philosopher_id = $1
      `,
      [id]
    );
    philosopher.books = booksRes.rows.map(r => ({
      titulo: r.titulo,
      idioma: r.idioma,
      estado: r.estado,
      descripcion: r.descripcion
    }));

    const worksRes = await client.query(
      `
      SELECT titulo, descripcion
      FROM works
      WHERE philosopher_id = $1
      `,
      [id]
    );
    philosopher.works = worksRes.rows.map(r => ({
      titulo: r.titulo,
      descripcion: r.descripcion
    }));

    const quotesRes = await client.query(
      `
      SELECT cita
      FROM quotes
      WHERE philosopher_id = $1
      `,
      [id]
    );
    philosopher.quotes = quotesRes.rows.map(r => r.cita);

    const duration = Date.now() - startTime;
    console.log(`[getPhilosopherById] Query completed in ${duration}ms for id ${id}`);
    return res.json(philosopher);
  } catch (err) {
    console.error('Error al obtener filósofo por ID:', err);
    return res.status(500).json({ error: 'Error al obtener filósofo' });
  } finally {
    client.release();
  }
}

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
  try {
    const philosophers = await philosopherModel.modelGetPhilosophersByEra(q, eras);
    res.json(philosophers);
  } catch (err) {
    console.error("Error al obtener filósofos:", err);
    res.status(500).json({ error: "Error al obtener filósofos" });
  }
};

function parseFechaOrden(rawDate, texto) {
  let year = null, month = 1, day = 1, isBC = false;

  // 1) Si rawDate es no vacío y NO empieza con '-', es AD completa:
  if (rawDate && !rawDate.startsWith('-')) {
    const [yyyy, mm, dd] = rawDate.split('-').map(n => parseInt(n, 10));
    year = yyyy; month = mm; day = dd;
  }
  // 2) Si rawDate empieza con '-', lo consideramos BC:
  else if (rawDate && rawDate.startsWith('-')) {
    const [_, yyyy] = rawDate.match(/-?(\d{1,4})/) || [];
    year = parseInt(yyyy, 10);
    isBC = true;
  }
  // 3) Si rawDate está vacío pero texto es sólo año (p.ej. "623"):
  else if (/^\d{1,4}$/.test(texto)) {
    year = parseInt(texto, 10);
  }
  // 4) Si rawDate vacío y texto contiene "a.C." (p.Ej "623 a.C.")
  else if (/(\d{1,4})\s*a\.?C\.?/i.test(texto || '')) {
    const [, y] = texto.match(/(\d{1,4})\s*a\.?C\.?/i);
    year = parseInt(y, 10);
    isBC = true;
  }

  if (year === null) return null;
  // formatear YYYYMMDD
  const num = year * 10000 + month * 100 + day;
  return isBC ? -num : num;
}

const createPhilosopher = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      nombre,
      fecha_nacimiento: rawFechaNacimiento,
      fecha_texto,
      lugar_nacimiento,
      fecha_muerte,
      lugar_muerte,
      era,
      escuela,
      religion,
      notas,
      legado,
      ocupacion,
      intereses,
      conceptos,
      influencias,
      estudiantes,
      maestros,
      books,
      works,
      quotes,
      image_url
    } = req.body;

    let fecha_nacimiento = null;
    if (rawFechaNacimiento && !rawFechaNacimiento.startsWith('-')) {
      fecha_nacimiento = rawFechaNacimiento;
    } else if (/^\d{1,4}$/.test(fecha_texto || '')) {
      const yyyy = fecha_texto.padStart(4, '0');
      fecha_nacimiento = `${yyyy}-01-01`;
    }

    const fecha_orden = parseFechaOrden(rawFechaNacimiento, fecha_texto);


    const insertPhilosopherText = `
      INSERT INTO philosophers
        (nombre, fecha_nacimiento, fecha_texto, lugar_nacimiento, fecha_muerte, lugar_muerte,
         era_id, escuela_id, religion_id, notas, fecha_orden, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;
    `;
    const insertPhilosopherValues = [
      nombre,
      fecha_nacimiento,
      fecha_texto || null, 
      lugar_nacimiento || null,
      fecha_muerte || null,
      lugar_muerte || null,
      era,
      escuela,
      religion,
      notas || null,
      fecha_orden,
      image_url
    ];

    const philosopherResult = await client.query(
      insertPhilosopherText,
      insertPhilosopherValues
    );
    const philosopherId = philosopherResult.rows[0].id;

    const insertTextArray = async (arr, table, column) => {
      if (!Array.isArray(arr) || arr.length === 0) return;
      const valid = arr.filter(x => x && x.toString().trim() !== '');
      if (valid.length === 0) return;
      const promises = valid.map(texto =>
        client.query(
          `INSERT INTO ${table} (philosopher_id, ${column}) VALUES ($1, $2)`,
          [philosopherId, texto]
        )
      );
      await Promise.all(promises);
    };

    await insertTextArray(legado,      'legacies',    'legado');
    await insertTextArray(ocupacion,   'occupations', 'ocupacion');
    await insertTextArray(intereses,   'interests',   'interest');
    await insertTextArray(conceptos,   'concepts',    'concepto');
    await insertTextArray(influencias, 'influences',  'influencia');
    await insertTextArray(estudiantes, 'students',    'student_name');
    await insertTextArray(maestros,    'teachers',    'teacher_name');

    if (Array.isArray(books) && books.length > 0) {
      const validBooks = books.filter(b => b.titulo && b.titulo.toString().trim() !== '');
      if (validBooks.length > 0) {
        await Promise.all(
          validBooks.map(b =>
            client.query(
              `
                INSERT INTO books
                  (philosopher_id, titulo, idioma, estado, descripcion)
                VALUES ($1, $2, $3, $4, $5)
              `,
              [philosopherId, b.titulo, b.idioma || null, b.estado || null, b.descripcion || null]
            )
          )
        );
      }
    }

    if (Array.isArray(works) && works.length > 0) {
      const validWorks = works.filter(w => w.titulo && w.titulo.toString().trim() !== '');
      if (validWorks.length > 0) {
        await Promise.all(
          validWorks.map(w =>
            client.query(
              `
                INSERT INTO works
                  (philosopher_id, titulo, descripcion)
                VALUES ($1, $2, $3)
              `,
              [philosopherId, w.titulo, w.descripcion || null]
            )
          )
        );
      }
    }

    if (Array.isArray(quotes) && quotes.length > 0) {
      const validQuotes = quotes.filter(q => q && q.toString().trim() !== '');
      if (validQuotes.length > 0) {
        await Promise.all(
          validQuotes.map(cita =>
            client.query(
              `INSERT INTO quotes (philosopher_id, cita) VALUES ($1, $2)`,
              [philosopherId, cita]
            )
          )
        );
      }
    }

    await client.query('COMMIT');
    return res
      .status(201)
      .json({ message: 'Filósofo creado exitosamente', id: philosopherId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear filósofo:', error);
    return res.status(500).json({ error: 'Error al crear filósofo' });
  } finally {
    client.release();
  }
}

const updatePhilosopher = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      nombre,
      fecha_nacimiento: rawFechaNacimiento,
      fecha_texto,
      lugar_nacimiento,
      fecha_muerte,
      lugar_muerte,
      era,
      escuela,
      religion,
      notas,
      legado,
      ocupacion,
      intereses,
      conceptos,
      influencias,
      estudiantes,
      maestros,
      books,
      works,
      quotes,
      image_url
    } = req.body;

    let fecha_nacimiento = null;
    if (rawFechaNacimiento && !rawFechaNacimiento.startsWith('-')) {
      fecha_nacimiento = rawFechaNacimiento;
    } else if (/^\d{1,4}$/.test(fecha_texto||'')) {
      const yyyy = fecha_texto.padStart(4,'0');
      fecha_nacimiento = `${yyyy}-01-01`;
    }
    const fecha_orden = parseFechaOrden(rawFechaNacimiento, fecha_texto);

    const updateMainText = `
      UPDATE philosophers SET
        nombre           = $1,
        fecha_nacimiento = $2,
        fecha_texto      = $3,
        lugar_nacimiento = $4,
        fecha_muerte     = $5,
        lugar_muerte     = $6,
        era_id           = $7,
        escuela_id       = $8,
        religion_id      = $9,
        notas            = $10,
        fecha_orden      = $11,
        image_url        = $12
      WHERE id = $13
    `;
    const updateMainValues = [
      nombre,
      fecha_nacimiento,
      fecha_texto || null,
      lugar_nacimiento || null,
      fecha_muerte || null,
      lugar_muerte || null,
      era,
      escuela,
      religion,
      notas || null,
      fecha_orden,
      image_url,
      id
    ];
    await client.query(updateMainText, updateMainValues);

    const childTables = [
      'legacies',
      'occupations',
      'interests',
      'concepts',
      'influences',
      'students',
      'teachers',
      'books',
      'works',
      'quotes'
    ];
    for (let tbl of childTables) {
      await client.query(`DELETE FROM ${tbl} WHERE philosopher_id = $1`, [id]);
    }

    const insertTextArray = async (arr, table, column) => {
      if (!Array.isArray(arr) || arr.length === 0) return;
      const valid = arr.filter(x => x && x.toString().trim() !== '');
      if (valid.length === 0) return;
      const promises = valid.map(texto =>
        client.query(
          `INSERT INTO ${table} (philosopher_id, ${column}) VALUES ($1, $2)`,
          [id, texto]
        )
      );
      await Promise.all(promises);
    };

    await insertTextArray(legado,      'legacies',    'legado');
    await insertTextArray(ocupacion,   'occupations', 'ocupacion');
    await insertTextArray(intereses,   'interests',   'interest');
    await insertTextArray(conceptos,   'concepts',    'concepto');
    await insertTextArray(influencias, 'influences',  'influencia');
    await insertTextArray(estudiantes, 'students',    'student_name');
    await insertTextArray(maestros,    'teachers',    'teacher_name');

    if (Array.isArray(books) && books.length > 0) {
      const validBooks = books.filter(b => b.titulo && b.titulo.toString().trim() !== '');
      if (validBooks.length > 0) {
        await Promise.all(
          validBooks.map(b =>
            client.query(
              `
                INSERT INTO books
                  (philosopher_id, titulo, idioma, estado, descripcion)
                VALUES ($1, $2, $3, $4, $5)
              `,
              [id, b.titulo, b.idioma || null, b.estado || null, b.descripcion || null]
            )
          )
        );
      }
    }

    if (Array.isArray(works) && works.length > 0) {
      const validWorks = works.filter(w => w.titulo && w.titulo.toString().trim() !== '');
      if (validWorks.length > 0) {
        await Promise.all(
          validWorks.map(w =>
            client.query(
              `
                INSERT INTO works
                  (philosopher_id, titulo, descripcion)
                VALUES ($1, $2, $3)
              `,
              [id, w.titulo, w.descripcion || null]
            )
          )
        );
      }
    }

    if (Array.isArray(quotes) && quotes.length > 0) {
      const validQuotes = quotes.filter(q => q && q.toString().trim() !== '');
      if (validQuotes.length > 0) {
        await Promise.all(
          validQuotes.map(cita =>
            client.query(
              `INSERT INTO quotes (philosopher_id, cita) VALUES ($1, $2)`,
              [id, cita]
            )
          )
        );
      }
    }

    await client.query('COMMIT');
    return res.json({ message: 'Filósofo actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar filósofo:', error);
    return res.status(500).json({ error: 'Error al actualizar filósofo' });
  } finally {
    client.release();
  }
}

const deletePhilosopher = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const childTables = [
      'legacies',
      'occupations',
      'interests',
      'concepts',
      'influences',
      'students',
      'teachers',
      'books',
      'works',
      'quotes'
    ];
    for (let tbl of childTables) {
      await client.query(`DELETE FROM ${tbl} WHERE philosopher_id = $1`, [id]);
    }

    await client.query(
      `DELETE FROM philosophers WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');
    return res.json({ message: 'Filósofo eliminado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar filósofo:', error);
    return res.status(500).json({ error: 'Error al eliminar filósofo' });
  } finally {
    client.release();
  }
}

module.exports = {
  getAllPhilosophers,
  getPhilosopherById,
  searchPhilosophers,
  getPhilosophersByEra,
  createPhilosopher,
  updatePhilosopher,
  deletePhilosopher  
}