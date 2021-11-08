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
            res.redirect('/');
        }
        res.render('login', { title: 'Express' });

});

router.post('/login', controller.Login);

router.get('/sign_up', function (req, res, next) {
    res.render('sign_up', { title: 'Express' });
});

router.post('/sign_up', controller.SignIn);

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;