const express = require('express');
const router = express.Router();

const { getContactUs, postContactUs } = require('../Controllers/contactUsControllers');
const { contactValidator } = require('../middlewares/validators');
const validateRequest = require('../middlewares/validateRequest');

router.get('/', getContactUs);
router.post('/', contactValidator, validateRequest, postContactUs);

module.exports = router;
