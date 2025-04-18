const express = require('express');
const router = express.Router();
const { createReview, getAllReviews } = require('../controllers/reviews.controller.js');

router.get('/', getAllReviews);
router.post('/', createReview);

module.exports = router;