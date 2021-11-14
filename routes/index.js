var express = require('express');
const apiAuth = require('../controller/api/api.auth');
const controller = require('../controller/controller.index');
var router = express.Router();

/* GET home page. */

router.get('/', controller.index);

router.get('/navigation', function (req, res, next) {
    res.render('navigation', { title: 'Express' });
});
router.get('/language_list', function (req, res, next) {
    res.render('language_list', { title: 'Express' });
});
router.get('/project', function (req, res, next) {
    res.render('project', { title: 'Express' });
});
router.get('/profile', function (req, res, next) {
    res.render('profile', { title: 'Express' });
});
router.get('/project_main', function (req, res, next) {
    res.render('project_main', { title: 'Express' });
});
module.exports = router;
