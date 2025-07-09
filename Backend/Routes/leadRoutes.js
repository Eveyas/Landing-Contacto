const express = require('express');
const router = express.Router();
const leadController = require('../Controllers/leadController');
const authMiddleware = require('../Middleware/authMiddleware');
const { leadStatusValidator } = require('../Middleware/validators');
const validateRequest = require('../Middleware/validateRequest');

router.get('/', authMiddleware, leadController.getLeads);
router.put('/:id/status', authMiddleware, leadStatusValidator, validateRequest, leadController.updateLeadStatus);
router.get('/status-counts', authMiddleware, leadController.getStatusCounts);

module.exports = router;