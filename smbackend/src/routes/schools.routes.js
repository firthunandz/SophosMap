const express = require('express');
const router = express.Router();
const schoolsController = require('../controllers/schools.controller');

router.get('/', schoolsController);

module.exports = router;