const express = require('express');
const router = express.Router();
const { getAllPhilosophers, getPhilosopherById, searchPhilosophers } = require('../controllers/philosopher.controller');

router.get('/search', searchPhilosophers);
router.get('/', getAllPhilosophers);
router.get('/:id', getPhilosopherById );

module.exports = router;