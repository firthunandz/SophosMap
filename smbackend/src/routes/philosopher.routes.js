const express = require('express');
const router = express.Router();
const { getAllPhilosophers, handleGetPhilosopherById, searchPhilosophers } = require('../controllers/philosopher.controller');

router.get('/search', searchPhilosophers);
router.get('/', getAllPhilosophers);
router.get('/:id', handleGetPhilosopherById );

module.exports = router;