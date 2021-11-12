const db = require('../Server/dbConn');
const apiSearch = require('./api/api.search');

exports.profile = async (req,res,next) =>{
    // TODO: 업데이트 체크
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try{
        
    }catch(e){
        res.status(500).json(e);
    }finally{
        connection.release();
    }
}