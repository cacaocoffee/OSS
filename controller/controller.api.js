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


exports.postInviteProject= async(req,res,next)=>{
    function jsonData(success, value){
        return {'success': success, 'value':value};
    }
    if(! await apiAuth.isLogined(req)) return res.jsonData(false, '잘못된 접근입니다.');
    
    try{

        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            const projectId = req.body.projectid || null;   // 참여할 프로젝트 id
            const inviteUserId = req.session.user;          // 프로젝트에 참여할 user 식별용 id

            if(projectId === null) return res.json(jsonData(false, '잘못된 프로젝트입니다.'))
            
            // TODO: project 참가


            // ------------------------------------

            return res.json(jsonData(true, '프로젝트 참여 코드가 바인딩되어 있지 않습니다. 바인딩 작업을 진행해주세요.'));
            // 작업후 상단 코드및 본 주석은 삭제 바람.

            return res.json(jsonData(true, '프로젝트에 참여했습니다.'));
            
        }catch(e){
            return res.json(jsonData(false, '프로젝트 참여에 실패했습니다.'));
        }finally{
            await connection.release();
        }

    }catch(e){
        return res.json(jsonData(false, '알 수 없는 오류'));
    }
}