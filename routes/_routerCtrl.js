var express = require('express');
var router = express.Router();

var indexRouter = require("./index");
var usersRouter = require("./users")

router.use('/', indexRouter);
router.use('/users', usersRouter);

module.exports = router;