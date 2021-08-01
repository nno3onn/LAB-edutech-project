const express = require('express');
const router = express.Router();

router.get('/study', (req, res, next) => {
    res.render('study');
});
router.get('/quiz', (req, res, next) => {
    res.render('quiz');
});

module.exports = router;
