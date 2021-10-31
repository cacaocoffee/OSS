var express = require('express');
var router = express.Router();
var db = require('mysql');

router.get('/',function(req,res,next){
    res.render('install',{
        title:"TeamOSS",
        set_comp:false
    });
    res.end();
    
});

router.post('/', function(req, res, next){
    console.log(req.body);
    var c = db.createConnection({
        host:req.body.dbHost,
        user:req.body.dbId,
        password:req.body.dbPassword,
    });    
    
    let set = {
        title:"TeamOSS",
        set_comp:true,
    };

    c.connect(function(err){
        if(err) throw err;
        console.log(req.body.dbName);
        c.query(`CREATE DATABASE IF NOT EXISTS ??;`, [req.body.dbName], function(err, result){
            if(err) throw err;
            console.log("Create Database");
            // TODO: 유저 데이터 테이블 등 서비스에 필요한 테이블 작성 필요

            res.render('install', set);
            process.exit();
        });    
    });        

});

module.exports = router;
