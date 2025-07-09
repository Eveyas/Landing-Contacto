const express = require('express');
const router = express.Router();

const { getContactUs, postContactUs } = require('../Controllers/contactUsControllers');
const { contactValidator } = require('../Middleware/validators');
const validateRequest = require('../Middleware/validateRequest');

router.get('/', getContactUs);
router.post('/', contactValidator, validateRequest, postContactUs);

module.exports = router;
