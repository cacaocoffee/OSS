const db = require('../Server/dbConn');
const apiAuth = require('./api/api.auth');
const apiCommon = require('./api/api.common');
const apiSearch = require('./api/api.search');

exports.default = async (req,res,next) =>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn => conn);
        try{

            const loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);
            
            let temp = await apiSearch.GetUserProjectList(connection, req.session.user);
            const projectList = [];
            for(let project of temp){
                if(project.leaderid == req.session.user){
                    projectList.push({
                        id:project.id,
                        name:project.name
                    });
                }
            }

            let mytodo = await apiSearch.GetMyTodo(connection, req.session.user);
            let sharedTodo = await apiSearch.GetSharedTodo(connection, req.session.user);
            return res.render('layout', apiCommon.renderData(
                'todo',
                ['todo', 'form'],
                ['script'],
                {
                    user: loginedUser,
                    projectList: projectList,
                    myTodo: mytodo,
                    sharedTodo: sharedTodo
                }
            ))

        }catch(e){
            console.log(e);
            return res.redirect(req.baseUrl);
        }finally{
            await connection.release();
        }
    }catch(e){
        return next(e);
    }


}

exports.postRegisteration = async (req,res,next) =>{
    if(!await apiAuth.isLogined(req)) return res.redirect('/');
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn=>conn);
        try{
            let projectid = req.body.projectid || null;
            const overwrite = req.body.overwrite == 1;
            const userList = req.body.todoUser || [req.session.user];
            const todoText = req.body.todo || '';
            const deadline = req.body.deadline || null;
            console.log(req.body);
            if(todoText.length < 1) return res.redirect(req.baseUrl);
            // 할 일이 없으면 리다이렉트
            
            if(projectid == -1) projectid = null; // 개인에 대한 내용이라면 닫기
            if(projectid != null){
                if((await apiSearch.GetProject(connection, projectid)).leaderid != req.session.user) return res.redirect(req.baseUrl);
                // 프로젝트 소유자가 아닌 경우 리다이렉트
            }

            if(overwrite) userList = [req.session.user];

            await apiSearch.SetTodo(connection, todoText, overwrite, deadline, userList, projectid);

            return res.redirect(req.baseUrl);

        }catch(e){
            return res.redirect(req.baseUrl);
        }finally{
            await connection.release();
        }

    }catch(e){
        return next(e);
    }
    
}