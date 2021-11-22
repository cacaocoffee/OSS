const db = require('../Server/dbConn');
const apiSearch = require('./api/api.search');
const apiAuth = require('./api/api.auth');
const apiCommon = require('./api/api.common');

function renderData(loginedUser, customize, targetUserInfo, projectList){
    let result = apiCommon.renderData(
        'project',
        ['project'],
        ['script'],
        {
            user:loginedUser,
            custom:customize,
            targetUser:targetUserInfo,
            project: projectList
        }
    )
    return result;
}

function renderForDetail(loginedUser, projectInfo, coworker){
    let result = apiCommon.renderData(
        'project-detail',
        ['project_detail'],
        ['script'],
        {
            user:loginedUser,
            project:projectInfo
        }
    )

    return result;
}

exports.getProject = async (req,res, next)=>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            let page = parseInt(req.query.page) || 0;

            let count = 100;
            let limits = count * page;
            
            let targetUserId = req.query.userid || null;
            let projectList = null;

            if(!targetUserId){
                projectList = await apiSearch.GetProjectList(connection, [limits, count]) || [];
            }else{
                projectList = await apiSearch.GetUserProjectList(connection, targetUserId) || [];
            }

            let loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);
            let targetUserInfo = await apiAuth.GetUserInfo(connection, targetUserId) || null;
            
            res.render('layout', renderData(
                loginedUser,
                targetUserId ? 2 : 0,
                targetUserInfo,
                projectList
            ));

        }catch(e){
            return next(e);
        }

    }catch(e){
        return next(e);
    }
    
}

exports.getMyProject = async (req,res,next)=>{
    if(! await apiAuth.isLogined(req)){
        return res.redirect('/');
    }
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            let loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);

            let myProject = await apiSearch.GetUserProjectList(connection, req.session.user) || [];

            res.render('layout', renderData(
                loginedUser,
                1,
                null,
                myProject
            ));
        }catch(e){
            return next(e);

        }finally{
            await connection.release();
        }
    }catch(e){
        return next(e);
    }

}

exports.getProejctDetail = async(req,res,next)=>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');
    
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn => conn);
        try{

            let projectId = req.query.projectid || null;
            if(!projectId) return res.redirect('/project');

            let projectInfo = await apiSearch.GetProject(connection, projectId);

            let loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);
            res.render('layout', renderForDetail(
                loginedUser,
                projectInfo))
        }catch(e){
            return next(e);
        }finally{
            await connection.release();
        }
    }catch(e){
        return next(e);
    }
}

exports.getProjectMake = async(req,res,next)=>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            let loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);
            let languageList = await apiSearch.GetLanguageList(connection);


            return res.render('layout', apiCommon.renderData(
                'project-make',
                ['project_make', 'form'],
                ['script'],
                {
                    user:loginedUser,
                    language:languageList
                }
            ));

        }catch(e){
            return next(e);
        }finally{
            await connection.release();
        }
    }catch(e){
        return next(e);
    }
}

exports.postProjectMake = async(req,res,next)=>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            const projectName = req.body.projectName || null;
            const projectDesc = req.body.projectDesc || null;
            const projectDeadline = req.body.projectDeadline || null;
            const languageList = req.body.language || null;
            
            if(projectName == null || projectDeadline == null) return res.redirect('/project');
            // 필수 항목 없으면 프로젝트 리스트 페이지로 리다이렉트


            const queryString = 'INSERT INTO project(name, leaderid, description, deadline) VALUES(?, ?, ?, ?);';
            const queryParam = [projectName, req.session.user, projectDesc, projectDeadline];

            let [project, ] = await connection.execute(queryString, queryParam);
            
            for(let lang of languageList){
                await connection.execute('INSERT INTO language_project(languageid, projectid) VALUES(?, ?);', [lang, project.insertId]);
            }

            await connection.execute('INSERT INTO project_user(userid, projectid) VALUES(?,?);', [req.session.user, project.insertId]);

            await connection.commit();
            return res.redirect(`/project/detail?projectid=${project.insertId}`);

        }catch(e){
            await connection.rollaback();
            return next(e);
        }finally{
            await connection.release();
        }
    }catch(e){
        return next(e);
    }
}