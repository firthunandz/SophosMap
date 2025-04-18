const { getUserById } = require('../models/user.model');

const userProfile = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
    
  } catch (error) {
    console.error('Error en userProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

module.exports = { 
  userProfile
};
