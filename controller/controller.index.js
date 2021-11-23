const apiSearch = require('./api/api.search');
const apiAuth = require('./api/api.auth');
const db = require('../Server/dbConn');
const apiCmn = require('./api/api.common');

exports.index = async (req, res, next) => {
    if (!apiAuth.isLogined(req)) {
        return res.redirect('/users/login');
    }

    try {
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn => conn);
        try {
            let recentProject = [];
            recentProject = await apiSearch.GetProjectList(connection);
            if (recentProject.length > 5) {
                recentProject = recentProject.slice(0, 5);
            }
            await apiSearch.GetUserList(connection);
            let myProject = [];
            myProject = await apiSearch.GetUserProjectList(connection, req.session.user);
            if(myProject.length > 5){
                myProject = myProject.slice(0, 5);
            }

            let todoList;
            // FIXME: 바로 뿌릴 수 있는 데이터 필요 >> 현재는 가공후에 뿌릴 수 있음
            todoList = await apiSearch.GetUserTodolist(connection, req.session.user);
            if (todoList.length > 5) {
                todoList = todoList.slice(0, 5);
            }
            await set
            let user = await apiAuth.GetUserInfo(connection, req.session.user);

            let result = apiCmn.renderData(
                'index', 
                ['index'], 
                ['script'],
                {
                    'user': user,
                    'recentProject': recentProject,
                    'myProject': myProject,
                    'todo': []
                }
            );
            res.render('layout', result);
        } catch (e) {
            return next(e);
        } finally {
            await connection.release();
        }
    } catch (e) {
        next(e);
    }
}
