const express = require('express');
const router = express.Router();
const { userLogin, userRegister, refreshAccessToken } = require('../controllers/auth.controller')
const verifyToken = require('../middlewares/verify.jwt');
const checkAdminRole = require('../middlewares/admin.role');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.post('/refresh', refreshAccessToken);
router.get('/admin', verifyToken, checkAdminRole, (req, res) => {
  res.json({ message: 'Panel de administrador' });
});

module.exports = router;