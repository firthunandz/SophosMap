const express = require('express');
const router = express.Router();
const { userLogin, userRegister, userProfile } = require('../controllers/auth.controller')
const verifyToken = require('../middlewares/verify.jwt');
const checkAdminRole = require('../middlewares/admin.role');

// Ruta para login
router.post('/login', userLogin);

// Ruta para register
router.post('/register', userRegister);

router.get('/profile/:id', verifyToken, userProfile);

router.get('/admin', verifyToken, checkAdminRole, (req, res) => {
  res.json({ message: 'Panel de administrador' });
});

module.exports = router;