const express = require('express');
const router = express.Router();

router.get('/signIn', (req, res, next) => {
    res.render('signIn');
});
router.get('/signUp', (req, res, next) => {
    res.render('signUp');
});

module.exports = router;
