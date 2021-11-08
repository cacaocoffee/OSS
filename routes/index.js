var express = require('express');
const controller = require("../controller/controller.install");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    res.render('index', { title: 'Express' });
});

module.exports = router;
