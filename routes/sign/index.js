const express = require('express');
const router = express.Router();
const controller = require('./sign.controller');

router.get('/', controller.sign);

module.exports = router;
