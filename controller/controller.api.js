const db = require('../Server/dbConn');
const apiAuth = require('./api/api.auth');
const apiSearch = require('./api/api.search');

function jsonData(success, value){
    return {'success': success, 'value':value};
}

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
            await connection.release();
        }
    }catch(e){
        console.log(e);
    }

    return res.status(500).end();
    
}

exports.postInviteProject= async(req,res,next)=>{
    if(! await apiAuth.isLogined(req)) return res.json(jsonData(false, '잘못된 접근입니다.'));
    
    try{

        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            const projectId = req.body.projectid || null;   // 참여할 프로젝트 id
            const inviteUserId = req.session.user;          // 프로젝트에 참여할 user 식별용 id

            if(projectId === null) return res.json(jsonData(false, '잘못된 프로젝트입니다.'))
            
            await connection.execute('INSERT INTO project_user(userid, projectid) VALUES(?,?);', [inviteUserId, projectId]);

            await connection.commit();
            return res.json(jsonData(true, '프로젝트에 참여했습니다.'));
            
        }catch(e){
            await connection.rollback();

            switch(e.errno){
                case 1062:
                    return res.json(jsonData(false, '이미 참여중인 프로젝트입니다.'));
                default:
                    return res.json(jsonData(false, `알 수 없는 이유로 프로젝트 참여에 실패했습니다. 오류코드: ${e.errno}`));
            }
            
        }finally{
            await connection.release();
        }

    }catch(e){
        return res.json(jsonData(false, '알 수 없는 오류'));
    }
}

exports.postGetUserListWith = async(req,res,next)=>{
    if(! await apiAuth.isLogined(req)) return res.jsonData(false, '잘못된 접근입니다.');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            const langList = req.body.filter || [];
            // 검색시 적용할 필터
            let result; // 반환할 데이터
                result = await apiSearch.GetUserListWithLanguage(connection, langList);
            
            return res.json(jsonData(true, result));

        }catch(e){
            return res.json(jsonData(false, `오류:${e.errno}`));
        }finally{
            await connection.release();
        }
    }catch(e){
        return res.json(jsonData(false,`오류:${e.errno}`));
    }
}

// 입력으로 들어온 project id에 대한 프로젝트 정보 전달
exports.postProjectData = async(req,res,next) =>{
    if(! await apiAuth.isLogined(req)) return res.json(jsonData(false, '잘못된 접근입니다.'));
    
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{

            const selProjectedId = req.body.projectId || -1;
            if(selProjectedId < 1) return res.json(jsonData(false, '존재하지 않는 프로젝트 ID입니다.'));

            const project = await apiSearch.GetProject(connection, selProjectedId);

            if(project.leaderid != req.session.user) return res.json(jsonData(false, '접근 권한이 없습니다.'));
            // 선택한 프로젝트의 팀장이 본인이 아닐 때

            return res.json(jsonData(true, project));

        }catch(e){
            return res.json(jsonData(false, `오류:${e.errno}`));
        }finally{
            await connection.release();
        }
    }catch(e){
        return res.json(jsonData(false, `오류:${e.errno}`));
    }
}