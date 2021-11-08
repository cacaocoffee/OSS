var express = require('express');
const controller = require("../controller/controller.install");
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.session);
    if (!apiAuth.isLogined(req)) {
        return res.redirect('/users/login');
    }
    res.render('index', { title: 'Express' });
});

module.exports = router;
