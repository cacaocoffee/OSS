var express = require('express');
var router = express.Router();

var indexRouter = require("./index");
var usersRouter = require("./users");
const sitesubstitute = require('../server/config').config_site;

router.use('/', indexRouter);
router.use('/users', usersRouter);

router.use((req,res) =>{
    res.render('layout', {
        site_title: sitesubstitute.title,
        content:'common/error',
        css:[],
        error:"지정되지 않은 페이지입니다.",
    });
});

module.exports = router;