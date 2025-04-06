require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require("pg");

// Configuración del pool de PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const dataPath = path.join(__dirname, '/src/database/filosofos.json');
const philosophers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function insertWorks() {
  await client.connect();
  for (const philosopher of philosophers) {
    const { id, obras } = philosopher;
    
    if (!obras || obras.length === 0) continue;

    for (const obra of obras) {
      const titulo = typeof obra === 'string' ? obra : obra.titulo || null;
      const descripcion = typeof obra === 'object' && obra.descripcion ? obra.descripcion : null;

      if (titulo) {
        try {
          await client.query(
            'INSERT INTO works (titulo, descripcion, philosopher_id) VALUES ($1, $2, $3)',
            [titulo, descripcion, id]
          );
          console.log(`✅ Obra insertada: ${titulo}`);
        } catch (error) {
          console.error(`❌ Error insertando obra "${titulo}":`, error.message);
        }
      }
    }
  }

  await client.end();
  console.log('Carga finalizada.');
}

insertWorks();
