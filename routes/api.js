var express = require('express');
var router = express.Router();

const controller = require('../controller/controller.api');

router.get('/validID', controller.getValidID);


module.exports = router;