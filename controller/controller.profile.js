const db = require('../Server/dbConn');
const apiSearch = require('./api/api.search');

exports.findProfile = async (req,res,next) =>{
    // TODO: 업데이트 체크
    const pool = await db.pool();
    const connection = await pool.getConnection(async conn => conn);
    try{
        const result = apiSearch.GetLanguageList(connection);
        res.json(
            result
        );
        
    }catch(e){
        req.status(500).json(e);
    }finally{
        connection.release();
    }
}