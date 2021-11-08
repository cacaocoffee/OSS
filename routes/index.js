var express = require('express');
const controller = require("../controller/controller.install");
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!apiAuth.isLogined(req)) {
        return res.redirect('/users/login');
    }
    res.render('index', { title: 'Express' });
});

router.get('/navigation', function(req, res, next) {
  res.render('navigation', { title: 'Express' });
});
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });
});
module.exports = router;
