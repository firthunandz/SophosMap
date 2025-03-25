const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a Sophomap - Línea temporal de filósofos');
});

module.exports = router;