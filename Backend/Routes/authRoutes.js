const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../Controllers/authController');
const validateRequest = require('../Middleware/validateRequest');

// Validaciones
const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres')
];

// Rutas
router.post('/login', authController.login);
router.post('/register', registerValidator, validateRequest, authController.register);
router.get('/verify', authMiddleware, authController.verifyToken);
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);

module.exports = router;