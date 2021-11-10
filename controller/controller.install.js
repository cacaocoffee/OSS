const sec = require("../server/security");
const conf = require("../server/config");

const si = require("systeminformation");
const fs = require("fs");
const mysql = require("mysql2/promise");

exports.Installation = (req, res, next) => {
    res.render("install", {method:"get"});
};

exports.InitializeDB = async (req, res, next) => {
    const body = {
        db:{
            host: req.body.dbHost,
            user: req.body.dbId,
            password: req.body.dbPassword,
        },
        serial:'',
        version:conf.version
    };
    const resResult = {
        method:"post",
        result:false,
        value:'데이터베이스 초기화 성공.<br>설치를 완료했습니다. 서버를 다시 실행해주세요.'
    };

    const connection = await mysql.createConnection(body.db);
    try {
        await connection.beginTransaction();
        await connection.query("CREATE DATABASE IF NOT EXISTS ??;", req.body.dbName);
        await connection.query("USE ??;", req.body.dbName);
        body.db.database = req.body.dbName;
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
        query(`CREATE TABLE language_list (
            id int unsigned NOT NULL AUTO_INCREMENT COMMENT "언어 id",
            language varchar(16),
            PRIMARY KEY(id)
            );`);       

        await connection.
        query(`CREATE TABLE language_user (
                userid int unsigned NOT NULL COMMENT 'user테이블 id', 
                language int unsigned NOT NULL COMMENT '사용 언어',
                PRIMARY KEY(userid,language),
                FOREIGN KEY(userid) references user(id),
                FOREIGN KEY(language) references language_list(id)
            );`);
        await connection.
        query(`CREATE TABLE todo (
                id int unsigned NOT NULL AUTO_INCREMENT COMMENT 'todo 테이블 id',
                deadline DATE NOT NULL COMMENT '마감 기간',
                todo TEXT NOT NULL COMMENT '할일 목록',
                cleardate DATE COMMENT '실행날짜',
                do tinyint(1) NOT NULL default 0 COMMENT '할일 수행 여부',
                PRIMARY KEY(id),
                FOREIGN KEY(id) references user(id)
            );`);           

        ////////////////////추후 제거 요망 현재 테스트를 위한 데이터///////////////////////////////////////////////////////
        await connection.query(`INSERT INTO user (userid,pw,name) VALUES('kms16','9916','kms');`);
        await connection.query(`INSERT INTO user (userid,pw,name,authorize) VALUES('king12','theking','king',1);`);
        

        const langList = [
            'C/C++',
            'JAVA',
            'C#',
            'Python'
        ]
        
        for(let i = 0; i < langList.length; ++i){
            await connection.query(`INSERT INTO language_list (language) VALUES('${langList[i]}');`);
        }

        await connection.query(`INSERT INTO language_user (userid,language) VALUES('1','3');`);
        await connection.query(`INSERT INTO language_user (userid,language) VALUES('2','1');`);
        await connection.query(`INSERT INTO todo (deadline,todo) VALUES('2021-11-25','study DB');`);
        await connection.query(`INSERT INTO todo (deadline,todo) VALUES('2021-12-25','meet Santa');`);
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        
        await connection.commit();
        Promise.all([connection])
            .then((_) => {
                si.baseboard()
                    .then((el) => {
                        body.db.password = sec.Encrypt(body.db.password, sec.HashFor2Way(el.serial));
                        body.serial = el.serial;

                        fs.writeFileSync("./config.json", JSON.stringify(body), (_) => { });
                    })
                    .then((_) => {
                        resResult.result = true;
                        res.render("install", resResult);
                        res.end();
                        connection.end();
                    })
                    .catch((err) => {
                        resResult.value = `설정 파일을 만드는 중 오류가 발생했습니다. ${err}`;
                        res.render("install", resResult);
                        res.end();
                    });
            })
            .catch((err) => {
                console.log(err);
                resResult.value = `데이터베이스 초기화 실패. 다시 작업하세요. ${err}`;
                res.render("install", resResult);
                res.end();
            });
    } catch (e) {
        await connection.rollback();
        resResult.value = `설치에 실패했습니다.<br>오류 내용: ${e}`;
        res.render("install", resResult);
        res.end();
    }
    await connection.end();
};
