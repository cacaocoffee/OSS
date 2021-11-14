const apiSearch = require('./api/api.search');
const apiAuth = require('./api/api.auth');
const db = require('../Server/dbConn');

exports.index = async (req, res, next) =>{
    if(!apiAuth.isLogined(req)){
        return res.redirect('/users/login');
    }
    
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection( async conn => conn);
        try{
            let recentProject = [];
            recentProject = await apiSearch.GetProjectList(connection);
            if(recentProject.length > 5){
                recentProject = recentProject.slice(0, 5);
            }

            let todoList;

            todoList = await apiSearch.GetUserTodolist(connection, req.session.user);
            if(todoList.length > 5){
                todoList = todoList.slice(0, 5);
            }
            
            let user;
            {
                user = await apiAuth.GetUserInfo(connection, req.session.user);
            }
            
            res.render('layout', {
                'css':['glass', 'index'],
                'content':'index',
                'user':user,
                'recentProject': recentProject,
                'myProject': [],
                'todo': todoList,

            });
            
        }catch(e){
            return next(e);
        }finally{
            await connection.release();
        }
    }catch(e){
        next(e);
    }
}
