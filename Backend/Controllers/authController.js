const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { username, password } = req.body;
   
  try {
    const user = await User.findByUsername(username);
       if (!user) {
        console.log(`Usuario no encontrado: ${username}`);
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log(`Contraseña incorrecta para usuario: ${username}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ 
      userId: user.id,
      username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const verifyToken = (req, res) => {
  res.json({ 
    user: {
      id: req.user.userId,
      username: req.user.username
    }
  });
};

module.exports = {
  login,
  verifyToken
};
