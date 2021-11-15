var express = require('express');
const controller = require('../controller/controller.auth');
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/login', controller.getLogin);

router.post('/login', controller.Login);

router.get('/logout', controller.Logout);

router.get('/signup', controller.getSignUp);

router.post('/signup', controller.SignUp);

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});



module.exports = router;