const express = require('express');
const router = express.Router();
const { 
  getAllPhilosophers,
  getPhilosopherById,
  searchPhilosophers,
  createPhilosopher,
  updatePhilosopher,
  deletePhilosopher  
} = require('../controllers/philosopher.controller');

router.get('/search', searchPhilosophers);
router.get('/', getAllPhilosophers);
router.get('/:id', getPhilosopherById );
router.post('/', createPhilosopher);
router.put('/:id', updatePhilosopher);
router.delete('/:id', deletePhilosopher);

module.exports = router;