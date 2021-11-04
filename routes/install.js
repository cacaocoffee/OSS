const express = require('express');
const router = express.Router();
const sec = require("../Server/security");
const fs = require('fs');

router.get('/', function (req, res, next) { // 설치 초기 페이지
    res.render('install', {
        title: "TeamOSS",
        set_comp: false
    });
    res.end();

});

router.post('/', async function (req, res, next) { // 설치에 필요한 데이터를 얻은 상태
    
    const si = require('systeminformation');
    const body = {
        host: req.body.dbHost,
        user: req.body.dbId,
        password: req.body.dbPassword
    };
    const resResult = {
        title:"TeamOSS",
        set_comp:true,
        result:"데이터베이스 초기화 성공. 서버를 다시 실행해주세요."
    };
    
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(body)
    await connection.query("CREATE DATABASE IF NOT EXISTS ??;", [req.body.dbName]);
    await connection.query("USE ??;", req.body.dbName);
    await connection.query('CREATE TABLE ??(idx int PRIMARY KEY, values_t int);', 'test');
    
    Promise.all([connection])
    .then( _ =>{
        si.baseboard()
        .then(el=>{
            body.database = req.body.dbName;
            body.password = sec.Encrypt(body.password, sec.Hash(el.serial));

            fs.writeFile("./config.json", JSON.stringify(body), _ =>{});

        }).then(_ =>{
            res.render('install', resResult);
            res.end();
            process.exit();
        }).catch((err) =>{
            resResult.result = "설정 파일을 만드는 중 오류가 발생했습니다."
            res.render('install', resResult);
            res.end();
            
        }).catch(err =>{
            resResult.result = "데이터베이스 초기화 실패. 다시 작업하세요.";
            res.render('install',resResult);
            res.end();
        });
    });

});

module.exports = router;
