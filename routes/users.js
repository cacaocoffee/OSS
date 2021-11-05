var express = require('express');
const controller = require('../controller/controller.auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', controller.Login);

router.get('/sign_up', function(req, res, next) {
  res.render('sign_up', { title: 'Express' });
});
module.exports = router;
