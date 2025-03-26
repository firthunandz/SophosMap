const verifyToken = require('./verify.jwt');

const checkAdminRole = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: Se requieren privilegios de administrador' });
    }
    next();
  });
};

module.exports = checkAdminRole;