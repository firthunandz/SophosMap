const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verify.jwt');
const { userProfile, getFavorites, addFavorite, removeFavorite } = require('../controllers/user.controller');

router.get('/profile/:id', verifyToken, userProfile);
router.get('/favorites', verifyToken, getFavorites);
router.post('/favorites', verifyToken, addFavorite);
router.delete('/favorites/:philosopherId', verifyToken, removeFavorite);

module.exports = router;