const express = require('express');
const router = express.Router();
const optionalAuth = require('../middlewares/optionalAuth');
const { createReview, getAllReviews } = require('../controllers/reviews.controller.js');

router.get('/', getAllReviews);
router.post('/', optionalAuth, createReview);

module.exports = router;