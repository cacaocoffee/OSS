const db = require('../Server/dbConn');
const apiAuth = require('./api/api.auth');

exports.getValidID = async (req,res, next)=>{
    let result = {
        exists:false

    };
    const targetID = decodeURIComponent(req.query.id);

    if(targetID == undefined){
        return res.json(result);
    }
    
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection();
        
        try{
            let retn;
            retn = await apiAuth.validID(targetID);
            if(retn !== true){
                result.valid = retn;
            }else{
                result.valid = true;
            }

            retn = await apiAuth.existsID(connection, targetID);
            result.exists = retn == 0 ? false : true;

            return res.json(result);
        }catch(e){
            console.log(e);

        }finally{
            connection.release();
        }
    }catch(e){
        console.log(e);
    }

    return res.status(500).end();
    
}