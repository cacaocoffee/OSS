var express = require('express');
const controller = require('../controller/controller.auth');
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
        if(apiAuth.isLogined(req)){
            return res.redirect('/');
        }
        res.render('login');

});

router.post('/login', controller.Login);

router.get('/sign_up', function (req, res, next) {
    res.render('sign_up', { title: 'Express' });
});

router.post('/sign_up', controller.SignIn);

router.get('/profile', function (req, res, next) {
    res.render('profile', { title: 'Express' });
});

router.get('/navigation', function (req, res, next) {
    res.render('navigation', { title: 'Express' });
});

router.get('/profile', function (req, res, next) {
    res.render('profile', { title: 'Express' });
});
router.get('/language_list', function (req, res, next) {
    res.render('language_list', { title: 'Express' });
});
router.get('/project', function (req, res, next) {
    res.render('project', { title: 'Express' });
});
router.get('/project_main', function (req, res, next) {
    res.render('project_main', { title: 'Express' });
});
router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});



module.exports = router;