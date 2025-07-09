const { check } = require('express-validator');

exports.loginValidator = [
  check('username')
    .notEmpty().withMessage('Usuario requerido')
    .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres')
    .trim().escape(),
  check('password')
    .notEmpty().withMessage('Contraseña requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .trim()
];

exports.contactValidator = [
  check('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .trim().escape(),
  check('apellidos')
    .notEmpty().withMessage('Apellidos son requeridos')
    .trim().escape(),
  check('correo')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),
  check('telefono')
    .notEmpty().withMessage('Teléfono requerido')
    .isMobilePhone().withMessage('Teléfono inválido')
    .trim(),
  check('mensaje')
    .notEmpty().withMessage('Mensaje requerido')
    .trim().escape(),
  check('aceptaTerminos')
    .isBoolean().withMessage('aceptaTerminos debe ser booleano')
    .equals('true').withMessage('Debe aceptar los términos y condiciones'),
  check('recaptchaResponse')
    .notEmpty().withMessage('Token reCAPTCHA no proporcionado')
];

exports.leadStatusValidator = [
  check('status')
    .isIn(['nuevo', 'contactado', 'descartado'])
    .withMessage('Estado inválido')
];