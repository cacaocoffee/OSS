const express = require('express');
const controller = require('../controller/controller.install');
const router = express.Router();

router.get('/', controller.Installation);

router.post('/', controller.InitializeDB);

router.use(function(req,res){
    return res.redirect('/');
});

module.exports = router;
