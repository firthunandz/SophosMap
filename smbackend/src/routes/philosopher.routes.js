const express = require('express');
const router = express.Router();
const { getAllPhilosophers, handleGetPhilosopherById } = require('../controllers/philosopher.controller');

router.get('/', getAllPhilosophers);
router.get('/:id', handleGetPhilosopherById );

module.exports = router;