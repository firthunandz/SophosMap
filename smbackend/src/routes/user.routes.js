const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verify.jwt');
const { userProfile } = require('../controllers/user.controller');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorites.controller');

router.get('/profile/:id', verifyToken, userProfile);
router.get('/favorites', verifyToken, getFavorites);
router.post('/favorites', verifyToken, addFavorite);
router.delete('/favorites/:philosopherId', verifyToken, removeFavorite);

module.exports = router;