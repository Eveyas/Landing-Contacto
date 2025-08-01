const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * @desc    Iniciar sesión de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { username, password } = req.body;
   
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await User.comparePasswords(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    
    res.json({ 
      token,
      user: userResponse(user)
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    if (await User.findByUsername(username)) {
      return res.status(400).json({ error: 'Nombre de usuario no disponible' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: userResponse(newUser)
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

/**
 * @desc    Verificar token de usuario
 * @route   GET /api/auth/verify
 * @access  Private
 */
const verifyToken = (req, res) => {
  res.json({ user: userResponse(req.user) });
};

/**
 * @desc    Obtener todos los usuarios
 * @route   GET /api/auth/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(userResponse));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Funciones auxiliares
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const userResponse = (user) => {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.created_at
  };
};

module.exports = {
  login,
  register,
  verifyToken,
  getAllUsers
};