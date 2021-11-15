const sec = require('../server/security');
const db = require('../server/dbConn');
const apiAuth = require('./api/api.auth');
const apiSearch = require('./api/api.search');
const substitute = require('../Server/config').config_site;

exports.Login = async (req, res, next) => {
    if(apiAuth.isLogined(req)){
        return res.redirect('/');
    }

    let pool = await db.pool();
    let connection = await pool.getConnection(async conn => conn);
    try {
        const hashedPassword = sec.Hash(req.body['pw']);
        // TODO: DB 테이블이 작성되면 그에 맞게 수정해야함.
        const queryString = "SELECT * FROM user WHERE userid = ? AND pw = ?;";
        const queryParam = [req.body.id, hashedPassword];

        const [result, _] = await connection.execute(queryString, queryParam);

        // REVIEW: 프론트와 연계해 어떤 값을 보낼지 논의 필요
        if (!result[0]) {
            res.json({
                result: false,
                value: '로그인 실패'
            });
        } else {
            await connection.commit();
            // TODO: 다른 값으로 수정 필요
            req.session.user = result[0].id;
            req.session.save(_ => {
                return res.redirect('/');
            });
        }
    } catch (e) {
        await connection.rollback();
        res.status(500).json(e);

        throw e;
    } finally {
        await connection.release();
    }
}

exports.getSignUp = async (req, res, next) =>{
    if(await apiAuth.isLogined(req)){
        return res.redirect('/');
    }
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn => conn);
        try{
            let languageList = await apiSearch.GetLanguageList(connection);


            
            res.render('signup', {
                'site_title': substitute.title,
                'languageList':languageList
            });
            
        }catch(e){
            console.log(e);
            return res.status(500).end();
        }finally{
            await connection.release();
        }
    }catch(e){
        console.log(e);
        return res.status(500).end();
    }
} // /users/signup method = get

exports.SignUp = async (req, res, next) => {
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try {
        let queryString = 'SELECT * FROM ?? WHERE ?? = ?';
        let queryParam = ['user', 'userid', req.body.id];
        console.log(req.body);
        switch (await apiAuth.existsID(connection, req.body.id)) {
            case 1: {
                return res.json({
                    result: false,
                    value: "존재하는 ID"
                });

            }
            case -1: {
                return res.json({
                    result: false,
                    value: "데이터베이스 오류"
                });

            }
        }
        if (await apiAuth.existsID(connection, req.body.id)) {

        }

        queryString = 'INSERT INTO user(userid, pw, name) VALUES(?, ?, ?);';
        queryParam = [req.body.id, sec.Hash(req.body.pw), req.body.name];

        let [result,] = await connection.execute(queryString, queryParam);

        // TODO: 프론트와 연계해 어떤 값을 보낼지 논의 필요
        if ('insertId' in result) {   // 가입 성공
            await connection.commit();

            /*TODO: 현재는 가입 성공시 바로 default 로그인 페이지로 가지만, 
                    json으로 성공 여부를 넘기고 프론트에서 이동하는 것으로 */
            if (req.query['return']) {
                res.redirect(req.query['return']);
            } else {
                res.redirect('/users/login');
            }
        } else {                      // 가입 실패
            res.json({
                result: false,
                value: [
                    '등록 실패',
                    result
                ]
            });
        }

    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        await connection.release();
    }
}

exports.Logout = async(req, res, next) =>{
    req.session.destroy(_=>{
        res.redirect('/');
    });
    
}