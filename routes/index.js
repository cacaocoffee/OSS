var express = require('express');
const apiAuth = require('../controller/api/api.auth');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!apiAuth.isLogined(req)) {
        return res.redirect('/users/login');
    }
    // res.render('index', { title: 'Express' });
    res.render('layout', {
      content:"index",
      css:['style'],
      
    })
});

router.get('/pagenation', function(req, res, next) {
  res.render('pagenation', { title: 'Express' });
});
router.get('/language_list', function(req, res, next) {
  res.render('language_list', { title: 'Express' });
});
router.get('/project', function (req, res, next) {
  res.render('project', { title: 'Express' });
});
router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Express' });
});
router.get('/profile_edit', function (req, res, next) {
    res.render('profile_edit', { title: 'Express' });
});
router.get('/my_profile', function (req, res, next) {
  res.render('my_profile', { title: 'Express' });
});
router.get('/project_main', function(req, res, next) {
  res.render('project_main', { title: 'Express' });
});router.get('/project_form', function(req, res, next) {
  res.render('project_form', { title: 'Express' });
});;router.get('/project_edit', function(req, res, next) {
  res.render('project_edit', { title: 'Express' });
});
module.exports = router;
