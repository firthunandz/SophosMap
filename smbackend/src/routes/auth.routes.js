const express = require('express');
const router = express.Router();

// Ruta para login
router.post('/login', (req, res) => {
    res.send('Endpoint de login');
});

// Ruta para register
router.post('/register', (req, res) => {
    res.send('Endpoint de registro');
});

module.exports = router;