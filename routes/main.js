const express = require('express');
const router = express.Router();
const io = require('../bin/server');

router.get('/', (req, res, next) => {
    res.render('main');
});

module.exports = router;
