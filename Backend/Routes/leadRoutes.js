const express = require('express');
const router = express.Router();
const leadController = require('../Controllers/leadController');
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/', authMiddleware, leadController.getLeads);
router.put('/:id/status', authMiddleware, leadController.updateLeadStatus);
router.get('/status-counts', authMiddleware, leadController.getStatusCounts);

module.exports = router;