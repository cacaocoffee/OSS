var express = require('express');
const createError = require('http-errors');
var router = express.Router();

router.use(function(req,res,next){
    res.render('error', {
        message:"페이지 없음",
        error:{
            status:404,
            message:`http://` + req.hostname + req.url
        }
    })
    next(createError(404));
})

module.exports = router;
