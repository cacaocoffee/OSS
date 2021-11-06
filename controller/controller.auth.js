const sec = require('../server/security');
const db = require('../server/dbConn');
const apiAuth = require('./api/api.auth');


exports.Login = async (req, res, next) => {
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try {
        const hashedPassword = sec.Hash(req.body['pw']);
        // TODO: DB 테이블이 작성되면 그에 맞게 수정해야함.
        const queryString = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?;";
        const queryParam = ['user', 'id', req.body.id, 'pw', hashedPassword];
        
        const [result, ] = await connection.query(queryString, queryParam);
        
        // REVIEW: 프론트와 연계해 어떤 값을 보낼지 논의 필요
        if(!result[0]){
            res.json({
                result:false,
                value:'로그인 실패'
            });
        }else{
            await connection.commit();
            res.json({
                result:true,
                value:"로그인 성공"
            });
        }

        res.status(200);
        res.end();
    } catch (e) {
        await connection.rollback();
        res.status(500).json(e);

        throw e;
    } finally {
        connection.release();
    }
}

exports.SignIn = async (req,res,next) =>{
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try{
        let queryString = 'SELECT * FROM ?? WHERE ?? = ?';
        let queryParam = ['user', 'id', req.body.id];
        console.log(1);

        
        if(await apiAuth.existsID(connection, req.body.id)){
            res.json({
                result:false,
                value:"존재하는 ID"
            });
            return;
        }

        queryString = 'INSERT INTO ??(??, ??, ??) VALUES(?, ?, ?);';
        queryParam = ['user',        'id','pw','name',   req.body.id, sec.Hash(req.body.pw), req.body.name];

        let [result, ] = await connection.query(queryString, queryParam);
        
        // TODO: 프론트와 연계해 어떤 값을 보낼지 논의 필요
        if('insertId' in result){   // 가입 성공
            await connection.commit();
            
            res.json({
                result:true,
                value:[
                    '등록 성공',
                    result
                ]
            });
        }else{                      // 가입 실패
            res.json({
                result:false,
                value:[
                    '등록 실패',
                    result
                ]
            });
        }
        


    }catch(e){
        await connection.rollback();
        throw e;
    }finally{
        await connection.release();
    }
}

