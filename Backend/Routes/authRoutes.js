const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authMiddleware = require('../Middleware/authMiddleware');
const { loginValidator } = require('../middlewares/validators');
const validateRequest = require('../middlewares/validateRequest');

router.post('/login', loginValidator, validateRequest, authController.login);
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;
