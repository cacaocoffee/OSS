const express = require('express');
const controller = require('../controller/controller.install');
const router = express.Router();

router.get('/', controller.Installation);

router.post('/', controller.InitializeDB);

module.exports = router;
