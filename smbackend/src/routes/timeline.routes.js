const express = require('express');
const router = express.Router();
const timeline = require('../controllers/timeline.controller')

router.get('/', timeline);

module.exports = router;