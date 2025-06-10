const express = require('express');
const router = express.Router();
const religionController = require('../controllers/religions.controller');

router.get('/', religionController);

module.exports = router;