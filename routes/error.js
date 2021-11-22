var express = require('express');
const createError = require('http-errors');
var router = express.Router();

router.get(function(req,res,next){
    res.json({error:"잘못된 접근"});
})

module.exports = router;
