const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../database/json-data');

// Cargar todos los datos al iniciar la app
const philosophers = JSON.parse(fs.readFileSync(path.join(dataPath, 'philosophers.json'), 'utf8'));
const eras = JSON.parse(fs.readFileSync(path.join(dataPath, 'eras.json'), 'utf8'));
const schools = JSON.parse(fs.readFileSync(path.join(dataPath, 'schools.json'), 'utf8'));

// Función para buscar filósofos con filtros
const getPhilosophers = ({ era, school, name } = {}) => {
  let results = [...philosophers];
  
  if (era) {
    results = results.filter(p => p.era === era);
  }
  
  if (school) {
    results = results.filter(p => p.school === school);
  }
  
  if (name) {
    const searchTerm = name.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
  }
  
  return results;
};

// Obtener filósofo por nombre exacto
const getPhilosopherByName = (name) => {
  return philosophers.find(p => p.name === name);
};

module.exports = {
  getAllPhilosophers: () => philosophers,
  getPhilosophers,
  getPhilosopherByName,
  getAllEras: () => eras,
  getAllSchools: () => schools
};