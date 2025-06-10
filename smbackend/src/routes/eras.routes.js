const express = require('express');
const router = express.Router();
const erasController = require('../controllers/eras.controller');

router.get('/', erasController);

module.exports = router;