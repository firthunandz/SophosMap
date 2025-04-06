const express = require('express');
const router = express.Router();
const philosophersModel = require('../models/philosopher.model');

// GET /philosophers - Lista todos los filósofos con filtros opcionales
router.get('/', (req, res) => {
  const { era, school, search } = req.query;
  const philosophers = philosophersModel.getPhilosophers({ 
    era, 
    school, 
    name: search 
  });
  
  res.json(philosophers);
});

// GET /philosophers/:id - detalle por ID
router.get('/:id', async (req, res) => {
  try {
    const philosopher = await philosophersModel.getPhilosopherById(req.params.id);
    if (!philosopher) {
      return res.status(404).json({ error: 'Filósofo no encontrado' });
    }
    res.json(philosopher);
  } catch (err) {
    console.error('Error al obtener filósofo:', err);
    res.status(500).json({ error: 'Error al obtener el filósofo' });
  }
});

// GET /philosophers/:name - Detalle de un filósofo
router.get('/:name', async (req, res) => {
  try {
    const philosopher = await philosophersModel.getPhilosopherByName(req.params.name);
    if (!philosopher) {
      return res.status(404).json({ error: 'Filósofo no encontrado' });
    }
    res.json(philosopher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el filósofo' });
  }
});

module.exports = router;