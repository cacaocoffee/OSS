var express = require('express');
var router = express.Router();

const indexRouter = require("./index");
const usersRouter = require("./users");
const projectRouter = require('./project');
const todoRouter = require('./todo');
const apiRouter = require("./api");
const sitesubstitute = require('../server/config').config_site;

router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/project', projectRouter);
router.use('/todo', todoRouter);

router.use('/api', apiRouter);

// router.get((req,res,next) =>{
//     res.render('layout', {
//         site_title: sitesubstitute.title,
//         content:'error',
//         css:[],
//         error:"지정되지 않은 페이지입니다.",
//     });
// });

module.exports = router;