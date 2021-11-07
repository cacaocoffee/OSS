var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/sign_up', function(req, res, next) {
  res.render('sign_up', { title: 'Express' });
});

router.get('/navigation', function(req, res, next) {
  res.render('navigation', { title: 'Express' });
});
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });
});
module.exports = router;
