var express = require('express');
const apiAuth = require('../controller/api/api.auth');
const controller = require('../controller/controller.index');
var router = express.Router();

/* GET home page. */

// router.get('/favicon.ico', (req,res,next)=>{
//     res.status(404).end();
// });

router.get('/', controller.index);

router.get('/pagenation', function(req, res, next) {
  res.render('pagenation', { title: 'Express' });
});
router.get('/language_list', function(req, res, next) {
  res.render('language_list', { title: 'Express' });
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

router.get('/project_form', function(req, res, next) {
  res.render('project_form', { title: 'Express' });
});

router.get('/project_edit', function(req, res, next) {
  res.render('project_edit', { title: 'Express' });
});
module.exports = router;
