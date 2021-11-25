var express = require('express');
var router = express.Router();
const controller = require('../controller/controller.todo');

router.post('/registration', controller.postRegisteration);
router.use(controller.default);

module.exports = router;