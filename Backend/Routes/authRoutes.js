const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../Controllers/authController');
const validateRequest = require('../Middleware/validateRequest');
const authMiddleware = require('../Middleware/authMiddleware');
const adminMiddleware = require('../Middleware/adminMiddleware');

// Validaciones
const authValidator = [
  body('username').trim().notEmpty().withMessage('Usuario es requerido'),
  body('password').notEmpty().withMessage('Contraseña es requerida')
];

const registerValidator = [
  ...authValidator,
  body('username')
    .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
  body('password')
    .isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres')
];

// Rutas de autenticación
router.post('/login', authValidator, validateRequest, authController.login);
router.post('/register', registerValidator, validateRequest, authController.register);
router.get('/verify', authMiddleware, authController.verifyToken);
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);

module.exports = router;