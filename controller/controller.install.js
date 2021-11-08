const sec = require("../server/security");

const si = require("systeminformation");
const fs = require("fs");
const mysql = require("mysql2/promise");
const { table } = require("console");
const { create } = require("domain");

exports.Installation = (req, res, next) => {
    let set = {
        title: "TeamOSS",
        set_comp: false,
    };

    res.render("install", set);
    res.end();
};

exports.InitializeDB = async (req, res, next) => {
    const body = {
        host: req.body.dbHost,
        user: req.body.dbId,
        password: req.body.dbPassword,
    };
    const resResult = {
        title: "TeamOSS",
        set_comp: true,
        result: "데이터베이스 초기화 성공. 서버를 다시 실행해주세요.",
    };

    const connection = await mysql.createConnection(body);
    try {
        await connection.beginTransaction();
        await connection.query("CREATE DATABASE IF NOT EXISTS ??;", req.body.dbName);
        await connection.query("USE ??;", req.body.dbName);
        /* TODO: 생성할 테이블 등 서비스 운영에 필요한 기본 테이블 등은 해당 주석 바로 아래 작성하면 됩니다. */
        await connection.
        query(`CREATE TABLE user (
                id int unsigned NOT NULL AUTO_INCREMENT COMMENT '식별용 ID', 
                userid varchar(16) NOT NULL COMMENT '로그인 ID',
                pw char(64) NOT NULL COMMENT '로그인 PASSWORD',
                name varchar(10) NOT NULL default 'unknown' COMMENT '사용자 이름',
                authorize tinyint(1) NOT NULL default 0 COMMENT '페이지 이용 승인 여부',
                PRIMARY KEY(id, userid)
            );`);
        await connection.
        query(`CREATE TABLE language_user (
                userid int unsigned NOT NULL AUTO_INCREMENT COMMENT 'user테이블 id', 
                language char(16) NOT NULL COMMENT '사용 언어',
                PRIMARY KEY(userid,language)
            );`);
        await connection.
        query(`CREATE TABLE language_list (
                C tinyint(1) NOT NULL default 0 'C 사용여부', 
                C++ tinyint(1) NOT NULL default 0 'C++ 사용여부', 
                C# tinyint(1) NOT NULL default 0 'C# 사용여부', 
                HTML tinyint(1) NOT NULL default 0 'HTML 사용여부', 
                PRIMARY KEY(userid,language)
            );`);       
        await connection.commit();
        Promise.all([connection])
            .then((_) => {
                si.baseboard()
                    .then((el) => {
                        body.database = req.body.dbName;
                        body.password = sec.Encrypt(body.password, sec.HashFor2Way(el.serial));
                        fs.writeFileSync("./config.json", JSON.stringify(body), (_) => { });
                    })
                    .then((_) => {
                        res.render("install", resResult);
                        res.end();
                        connection.end();
                        process.exit();
                    })
                    .catch((err) => {
                        resResult.result = `설정 파일을 만드는 중 오류가 발생했습니다. ${err}`;
                        res.render("install", resResult);
                        res.end();
                    });
            })
            .catch((err) => {
                console.log(err);
                resResult.result = `데이터베이스 초기화 실패. 다시 작업하세요. ${err}`;
                res.render("install", resResult);
                res.end();
            });
    } catch (e) {
        await connection.rollback();
        resResult.result = `설치 오류\n오류 내용: ${e}`;
        res.render("install", resResult);
        res.end();
    }
    await connection.end();
};
