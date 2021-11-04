const sec = require('../server/security');

const si = require('systeminformation');
const fs = require('fs');
const mysql = require('mysql2/promise');

exports.Installation = (req, res, next)=>{
    let set = {
        title:"TeamOSS",
        set_comp: false
    };
    
    res.render('install', set);
    res.end();
}

exports.InitializeDB = async (req, res, next) => {
    const body = {
        host: req.body.dbHost,
        user: req.body.dbId,
        password: req.body.dbPassword
    };
    const resResult = {
        title: "TeamOSS",
        set_comp: true,
        result: "데이터베이스 초기화 성공. 서버를 다시 실행해주세요."
    };
    try{
    const connection = await mysql.createConnection(body)
    await connection.query("CREATE DATABASE IF NOT EXISTS ??;", [req.body.dbName]);
    await connection.query("USE ??;", req.body.dbName);
    await connection.query('CREATE TABLE ??(idx int PRIMARY KEY, values_t int);', 'test');

    Promise.all([connection])
        .then(_ => {
            si.baseboard()
                .then(el => {
                    body.database = req.body.dbName;
                    body.password = sec.Encrypt(body.password, sec.Hash(el.serial));

                    fs.writeFile("./config.json", JSON.stringify(body), _ => { });

                }).then(_ => {
                    res.render('install', resResult);
                    res.end();
                    process.exit();

                }).catch((err) => {
                    resResult.result = `설정 파일을 만드는 중 오류가 발생했습니다. ${err}`
                    res.render('install', resResult);
                    res.end();

                });
        }).catch(err => {
            console.log(err);
            resResult.result = `데이터베이스 초기화 실패. 다시 작업하세요. ${err}`;
            res.render('install', resResult);
            res.end();
        });

    }catch(e){
        resResult.result = `설치 오류\n오류 내용: ${e}`;
        res.render('install', resResult);
        res.end();
    }

}