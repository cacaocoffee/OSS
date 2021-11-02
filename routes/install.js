const express = require('express');
const router = express.Router();
const db = require('mysql');
const sec = require("../Server/security");
const si = require("systeminformation");
const fs = require('fs');

router.get('/', function (req, res, next) { // 설치 초기 페이지
    res.render('install', {
        title: "TeamOSS",
        set_comp: false
    });
    res.end();

});

router.post('/', function (req, res, next) { // 설치에 필요한 데이터를 얻은 상태
    var c = db.createConnection({
        host: req.body.dbHost,
        user: req.body.dbId,
        password: req.body.dbPassword,
    });

    let set = {
        title: "TeamOSS",
        set_comp: true,
        result: "데이터베이스 접근 및 초기화 성공. 서버를 다시 시작하세요."
    };

    si.baseboard(el =>{
        const hash = sec.Hash(el.serial);
        let conf = {
            host:req.body.dbHost,
            user:req.body.dbId,
            password:sec.Encrypt(req.body.dbPassword, hash)
        };
        conf = JSON.stringify(conf);
        fs.writeFile("./config.json", conf, function(err){});
    });

    
    
    c.connect(function (err) {
        if (err) {
            set.result = "데이터베이스 접근 오류. 다시 데이터베이스 계정을 다시 확인해보세요.";
            set.set_comp = false;
            res.render('install', set);
            res.end();
            return;
        }
        
        c.query(`CREATE DATABASE IF NOT EXISTS ??;`, [req.body.dbName], function (err, result) {
            if (err){
                set.result = "데이터베이스 접근 오류. 다시 데이터베이스 계정을 다시 확인해보세요.";
                set.set_comp = false;
                res.render('install', set);
                res.end();
                return;
            }
            console.log("Create Database");
            // TODO: 유저 데이터 테이블 등 서비스에 필요한 테이블 작성 필요

            res.render('install', set);
            
        });
    });
});

module.exports = router;
