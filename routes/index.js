var express = require('express');
const apiAuth = require('../controller/api/api.auth');
const controller = require('../controller/controller.index');
var router = express.Router();

/* GET home page. */

router.get('/', controller.index);

module.exports = router;
