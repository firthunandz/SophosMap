const express = require('express');
const router = express.Router();
const { userLogin, userRegister } = require('../controllers/auth.controller')
const verifyToken = require('../middlewares/verify.jwt');
const checkAdminRole = require('../middlewares/admin.role');

// Ruta para login
router.get('/login', userLogin);

// Ruta para register
router.get('/register', userRegister);

router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Perfil protegido', user: req.user });
})

router.get('/admin', verifyToken, checkAdminRole, (req, res) => {
  res.json({ message: 'Panel de administrador' });
});

module.exports = router;