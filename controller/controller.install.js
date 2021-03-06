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
    try{
        const connection = await mysql.createConnection(body.db);
        try {
            await connection.beginTransaction();

            // 개발을 위한 dev config
            await connection.query("DROP DATABASE IF EXISTS ??;", [req.body.dbName]);

            await connection.query("CREATE DATABASE IF NOT EXISTS ?? default character set utf8 collate utf8_general_ci;", [req.body.dbName]);
            await connection.query("USE ??;", [req.body.dbName]);
            body.db.database = req.body.dbName;
            /* TODO: 생성할 테이블 등 서비스 운영에 필요한 기본 테이블 등은 해당 주석 바로 아래 작성하면 됩니다. */
            await connection.
            query(`CREATE TABLE IF NOT EXISTS user (
                    id int unsigned NOT NULL AUTO_INCREMENT COMMENT '식별용 ID', 
                    userid varchar(16) NOT NULL COMMENT '로그인 ID',
                    pw char(64) NOT NULL COMMENT '로그인 PASSWORD',
                    name varchar(10) NOT NULL default 'unknown' COMMENT '사용자 이름',
                    description tinytext COMMENT '유저 소개 글',
                    authorize tinyint(1) NOT NULL default 0 COMMENT '페이지 이용 승인 여부',
                    PRIMARY KEY(id, userid)
                ) default character set utf8 collate utf8_general_ci;`);
            await connection.
            query(`CREATE TABLE IF NOT EXISTS language_list (
                id int unsigned NOT NULL AUTO_INCREMENT COMMENT "언어 id",
                language varchar(16),
                PRIMARY KEY(id)
                ) default character set utf8 collate utf8_general_ci;`);       
    
            await connection.
            query(`CREATE TABLE IF NOT EXISTS language_user (
                    userid int unsigned NOT NULL AUTO_INCREMENT COMMENT 'user테이블 id', 
                    language int unsigned NOT NULL COMMENT '사용 언어',
                    PRIMARY KEY(userid, language),
                    FOREIGN KEY(userid) references user(id),
                    FOREIGN KEY(language) references language_list(id)
                ) default character set utf8 collate utf8_general_ci;`);
                           
            await connection.
            query(`CREATE TABLE IF NOT EXISTS todo (
                    id int unsigned NOT NULL AUTO_INCREMENT COMMENT 'todo 테이블 id',
                    deadline DATE NOT NULL COMMENT '마감 기간',
                    todo TEXT NOT NULL COMMENT '할일 목록',
                    PRIMARY KEY(id)
                ) default character set utf8 collate utf8_general_ci;`);
            await connection.
            query(`CREATE TABLE IF NOT EXISTS todo_user (
                userid int unsigned NOT NULL COMMENT '연결된 사용자 식별 ID',
                todoid int unsigned NOT NULL COMMENT '연결된 todo 정보 id',
                projectid int unsigned NULL COMMENT '연결된 프로젝트 아이디',
                overwrite tinyint(1) NOT NULL default 0 COMMENT '연결된 프로젝트 구성원의 상태 변경 가능 여부',
                done tinyint(1) NOT NULL default 0 COMMENT '할일 수행 여부',
                cleardate DATE COMMENT '실행 완료 시간',
                PRIMARY KEY(userid, todoid),
                FOREIGN KEY(userid) references user(id),
                FOREIGN KEY(todoid) references todo(id)
                ) default character set utf8 collate utf8_general_ci;`);        
            await connection.
            query(
                `CREATE TABLE IF NOT EXISTS project(
                    id int unsigned NOT NULL AUTO_INCREMENT COMMENT '프로젝트 식별 아이디',
                    leaderid int unsigned NOT NULL COMMENT '프로젝트 팀장 id ',
                    name tinytext NOT NULL COMMENT '프로젝트 이름',
                    description tinytext COMMENT '프로젝트 설명 및 내용',
                    deadline date NOT NULL COMMENT '프로젝트 종료 기간',
                    createtime datetime DEFAULT CURRENT_TIMESTAMP COMMENT '프로젝트 생성 기간',
                    PRIMARY KEY(id),
                    FOREIGN KEY(leaderid) references user(id)
                ) default character set utf8 collate utf8_general_ci;` );
            await connection.
            query(
                `CREATE TABLE IF NOT EXISTS project_user(
                    userid int unsigned NOT NULL COMMENT '유저 식별 아이디',
                    projectid int unsigned NOT NULL COMMENT '프로젝트 식별 아이디',
                    FOREIGN KEY(userid) references user(id),
                    FOREIGN KEY(projectid) references project(id),
                    PRIMARY KEY(userid, projectid)
                ) default character set utf8 collate utf8_general_ci;`
            );
            await connection.
            query(
                `CREATE TABLE IF NOT EXISTS language_project(
                    languageid int unsigned NOT NULL COMMENT '프로젝트 사용 언어 아이디',
                    projectid int unsigned NOT NULL COMMENT '프로젝트 식별 아이디',
                    FOREIGN KEY(languageid) references language_list(id),
                    FOREIGN KEY(projectid) references project(id),
                    PRIMARY KEY(languageid, projectid)
                ) default character set utf8 collate utf8_general_ci;`
            );

    
            const langList = [
                'C/C++', 'JAVA', 'C#', 'Python', 'Ruby',
                'HTML', 'CSS', 'Go', 'Javascript', 'Kotlin',
                'Perl', 'R', 'Swift', 'Objective-C', 'Basic', 'php',
                '아희', '어셈블리어(Intel)', '어셈블리어(ARM)', 'Pascal',
                'LISP', 'COBOL', 'Prolog'
            ].sort();
            const stackList = [
                'Python/Flask', 'Node.js', 'Spring', 'React', 'Vue.js', 'Bootstrap', 'ASP.NET'
            ].sort();
            
            for(let item of langList.concat(stackList)){
                await connection.execute(`INSERT INTO language_list (language) VALUES (?);`, [item]);
            }
            
            ////////////////////추후 제거 요망 현재 테스트를 위한 데이터///////////////////////////////////////////////////////
            await connection.query(`INSERT INTO user (userid,pw,name) VALUES('test1','${sec.Hash('test1')}','test1');`);
            await connection.query(`INSERT INTO user (userid,pw,name) VALUES('kms16','${sec.Hash('1625')}','kms');`);
            await connection.query(`INSERT INTO user (userid,pw,name,authorize) VALUES('king','${sec.Hash('1111')}','king',1);`);
            await connection.query(`INSERT INTO language_user (userid,language) VALUES('1','3');`);
            await connection.query(`INSERT INTO language_user (userid,language) VALUES('2','1');`);
            await connection.query(`INSERT INTO todo (deadline,todo) VALUES('2021-11-25','study DB');`);
            await connection.query(`INSERT INTO todo (deadline,todo) VALUES('2021-12-25','meet Santa');`);
            await connection.query(`INSERT INTO todo_user (userid,todoid) VALUES(1,1);`);
            await connection.query(`INSERT INTO todo_user (userid,todoid,projectid,overwrite) VALUES(1,2,1,1);`);
            await connection.query(`INSERT INTO project (leaderid,name, description, deadline) VALUES(1,'hello world', '테스트', '2021-11-25');`);
            await connection.query(`INSERT INTO project_user (userid, projectid) VALUES(1,1);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(1,1);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(2,1);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(5,1);`);
            await connection.query(`INSERT INTO project (leaderid,name, description, deadline) VALUES(2,'말많은 양의 왕', '테스트', '2021-11-27');`);
            await connection.query(`INSERT INTO project_user (userid, projectid) VALUES(2,2);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(5,2);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(2,2);`);
            await connection.query(`INSERT INTO language_project (languageid, projectid) VALUES(9,2);`);
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
    }catch(e){
        resResult.value = `DB 접근에 실패했습니다. 패드워드가 다르지는 않는지 확인하세요.<br>오류 내용:${e}`;
        res.render("install", resResult);
        res.end();
    }
};
