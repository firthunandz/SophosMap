const philosopherModel = require('../models/philosopher.model');

const getAllPhilosophers = async (req, res) => {
  const { era, school, search } = req.query;
  try {
    const philosophers = await philosopherModel.getPhilosophers({ 
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

const handleGetPhilosopherById = async (req, res) => {
  try {
    const philosopher = await philosopherModel.getPhilosopherById(req.params.id);
    if (!philosopher) {
      return res.status(404).json({ error: 'Filósofo no encontrado' });
    }
    res.json(philosopher);
  } catch (err) {
    console.error('Error al obtener filósofo:', err);
    res.status(500).json({ error: 'Error al obtener el filósofo' });
  }
}

module.exports = {
  getAllPhilosophers,
  handleGetPhilosopherById
}