const express = require('express');
const router = express.Router();
const { 
  userLogin,
  userRegister,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
  } = require('../controllers/auth.controller')
const verifyToken = require('../middlewares/verify.jwt');
const checkAdminRole = require('../middlewares/admin.role');

router.post('/login', userLogin);
router.post('/register', userRegister);
router.get('/verify-email', verifyEmail); 
router.post('/resend-verification', resendVerificationEmail);
router.post('/refresh', refreshAccessToken);
router.get('/admin', verifyToken, checkAdminRole, (req, res) => {
  res.json({ message: 'Panel de administrador' });
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;