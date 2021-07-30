const express = require('express');
const router = express.Router();
const controller = require('./study.controller');

router.get('/study', controller.study);
router.get('/quiz', controller.quiz);

module.exports = router;
