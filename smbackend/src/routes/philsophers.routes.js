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

// GET /philosophers/:name - Detalle de un filósofo
router.get('/:name', (req, res) => {
  const philosopher = philosophersModel.getPhilosopherByName(req.params.name);
  if (!philosopher) {
    return res.status(404).json({ error: 'Filósofo no encontrado' });
  }
  res.json(philosopher);
});

module.exports = router;