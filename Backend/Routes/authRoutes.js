const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/verify', authMiddleware, authController.verifyToken);


module.exports = router;