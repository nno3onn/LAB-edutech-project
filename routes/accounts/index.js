const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.get('/mypage', controller.mypage);
router.get('/mychart', controller.mychart);
router.get('/setting', controller.setting);

module.exports = router;
