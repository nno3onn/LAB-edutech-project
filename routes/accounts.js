const express = require('express');
const router = express.Router();
// const controller = require('./main.controller');

router.get('/mypage', (req, res, next) => {
    res.render('mypage');
});
router.get('/mychart', (req, res, next) => {
    res.render('mychart');
});
router.get('/setting', (req, res, next) => {
    res.render('setting');
})

module.exports = router;