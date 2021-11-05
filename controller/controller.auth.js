const sec = require('../server/security');
const db = require('../server/dbConn');


exports.Login = async (req, res, next) => {
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try {
        const hashedPassword = sec.HashFor2Way(req.body['pw']);
        // TODO: DB 테이블이 작성되면 그에 맞게 수정해야함.
        const queryString = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?;";
        const queryParam = ['user', 'user', req.body.id, 'password', hashedPassword];

        const [result, ] = await connection.query(queryString, queryParam);

        if(!result[0]){
            res.json({
                result:false,
                value:'로그인 실패'
            });
        }else{
            res.json({
                result:true,
                value:"로그인 성공"
            });
        }

        res.status(200);
        res.end();
    } catch (e) {
        res.status(500).json(e);

        throw e;
    } finally {
        connection.release();
    }
}