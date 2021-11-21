var express = require('express');
const authController = require('../controller/controller.auth');
const profileController = require('../controller/controller.user');
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', authController.getLogin);

router.post('/login', authController.Login);

router.get('/logout', authController.Logout);

router.get('/signup', authController.getSignUp);

router.post('/signup', authController.SignUp);

router.get('/logout', (req, res, next) => {
    req.session.destroy(_ =>{
        res.redirect('/');
    });
});



router.get('/profile', profileController.getProfile);

module.exports = router;