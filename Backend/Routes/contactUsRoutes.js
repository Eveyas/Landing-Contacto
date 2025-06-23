const express = require('express');
const router = express.Router();

const { getContactUs, postContactUs } = require('../Controllers/contactUsControllers');

router.get('/', getContactUs);
router.post('/', postContactUs);

module.exports = router;
