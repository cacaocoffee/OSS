const apiAuth = require('./api.auth');

function retnLangData(langid, langText){
    return {
        label:langText.toLowerCase(),
        id:langid,
        value:langText
    };
}
function retnProjectData(id,leaderid, name, desc, deadline,createtime, languageList){
    return {
        'id': id,
        'leaderid':leaderid,
        'name': name,
        'desc': desc,
        'deadline':deadline,
        'createtime':createtime,
        'language':languageList
    }
}
function retnProjectInfoData(project, userlist,langlist){
    project.userlist = userlist;
    project.langlist = langlist;
    return project;
}

function retnUserData(id, userid, name,description){
    return {
        'id' : id,
        'userid': userid,
        'name':name,
        'description': description
    };
}
function retnTodoData(toid,deadline,todo){
    return {
        id:toid,
        deadline:deadline,
        todo:todo,
    };
}
function retnUserTodoData(userid,todoid,projectid,overwrite,done,cleardate){
    return{
    'userid':userid,
    'todoid':todoid,
    'projectid':projectid,
    'overwrite':overwrite,
    'done':done,
    'cleardate':cleardate
    };
}
function retnTodoInfoData(project,todolist,todouserlist){
    project.todolist = todolist;
    project.todouserlist = todouserlist;
    return project;
}

exports.GetLanguageList = async (conn) =>{
    let [getList, ] = await conn.execute('SELECT * FROM language_list;');
    let result = [];

    getList.forEach((data) =>{
        result.push(retnLangData(data.id, data.language));
    });

    return result;
}

exports.GetUserLanguageList = async (conn, userid) =>{
    const queryString = 'SELECT * FROM language_user WHERE userid = ?;';
    const queryParam = [userid];
    let [listFromLangUser, ] = await conn.execute(queryString, queryParam);
    let result = [];
    
    for(let item of listFromLangUser){
        const queryString = 'SELECT language FROM language_list WHERE id = ?;';
        const queryParam = [item.language];
        
        let [listFromLangList,] = await conn.execute(queryString, queryParam);

        result.push(retnLangData(item.language, listFromLangList[0].language));
    };

    return result;
}

/* 두 번째 인자: [가져올 위치, 가져올 크기] */
exports.GetProjectList = async (conn, limits = null) =>{
    let [getList, ] = await conn.execute(`SELECT * FROM project ${limits != null ? 'LIMIT ' + limits[0] + ', ' + limits[1]: ''};`);
    let result = [];

    for(let project of getList){
        let langList = await this.GetProjectLanguageList(conn, project.id);
        result.push(retnProjectData(project.id,project.leaderid, project.name, project.description, project.deadline,project.createtime, langList));
    }

    return result;    
}

exports.GetProjectUserList = async(conn, projectid) =>{
    const queryString = 'SELECT userid FROM project_user WHERE projectid = ?;';
    const queryParam = [projectid];
    let result = [];

    let [userList, ] = await conn.execute(queryString, queryParam);

    for(let item of userList){
        result.push(await apiAuth.GetUserInfo(conn, item.userid));
    }

    return result;
}

exports.GetUserProjectList = async (conn, userid) =>{
    const queryString = 'SELECT projectid FROM project_user WHERE userid = ?;';
    const queryParam = [userid];
    let result = [];
    let [listFromProjUser, ] = await conn.execute(queryString, queryParam);

    for(let item of listFromProjUser){
        const queryString = 'SELECT * FROM project WHERE id = ?;';
        const queryParam = [item.projectid];
        let [listFromProj, ] = await conn.execute(queryString, queryParam);
        for(let project of listFromProj){
            let langList = await this.GetProjectLanguageList(conn, project.id)
            result.push(retnProjectData(project.id,project.leaderid, project.name, project.description, project.deadline,project.createtime, langList));
        }
    }
    return result;
}
exports.GetProjectLanguageList = async (conn, projectid) =>{
    const queryString = 'SELECT * FROM language_project WHERE projectid = ?;';
    const queryParam = [projectid];
    let [listFromLangProj, ] = await conn.query(queryString, queryParam);
    let result = [];
    for(let item of listFromLangProj){
        const queryString = 'SELECT language FROM language_list WHERE id = ?;';
        const queryParam = [item.languageid];
        let [listFromLangList,] = await conn.query(queryString, queryParam);
        result.push(retnLangData(item.languageid, listFromLangList[0].language));
    };
    return result;
}

exports.GetProject = async (conn,projectid) =>{
    const queryString = 'SELECT * FROM project WHERE id = ?;';
    const queryParam = [projectid];
    let [project, ] = await conn.query(queryString, queryParam);

    let result;
    let project_userlist= await this.GetProjectUserList(conn,projectid);
    let project_langlist= await this.GetProjectLanguageList(conn,projectid);

    result = retnProjectInfoData(
        retnProjectData(project[0].id,project[0].leaderid, project[0].name, project[0].description, project[0].deadline,project[0].createtime), 
        project_userlist, 
        project_langlist
    );
    return result;
}


exports.GetUserTodolist = async (conn, userid) =>{
    const queryString = 'SELECT * FROM todo_user WHERE userid = ?;';
    const queryParam = [userid];
    let [listFromTodo, ] = await conn.execute(queryString, queryParam);
    let result = [];
    listFromTodo.forEach((data) =>{
        result.push(retnUserTodoData(data.userid,data.todoid,data.projectid,data.overwrite,data.done,data.cleardate));
    });
    return result;
}

exports.GetTodolist = async (conn) =>{
    let [todolist, ] = await conn.execute('SELECT * FROM todo;');
    let result = [];
    todolist.forEach((data) =>{
        result.push(retnTodoData(data.id,data.deadline,data.todo));
    });
    return result;
}

exports.GetTodotext = async (conn, userid) =>{
    const queryString = 'SELECT * FROM todo_user WHERE userid = ?;';
    const queryParam = [userid];
    let [todo, ] = await conn.query(queryString, queryParam);

    let[todo_list,] = await this.GetTodolist(conn, userid);
    let[todouser_list,] =await this.GetUserTodolist(conn,userid);    
    result = retnTodoInfoData(
        retnUserTodoData(todo[0].userid,todo[0].todoid,todo[0].projectid,todo[0].overwrite,todo[0].done,todo[0].cleardate),
        todo_list,
        todouser_list
    );
    console.log(result);
    return result;
}

exports.SetTodo = async (conn,id,deadline,todo) => {
    const queryString = 'UPDATE todo SET deadline=?,todo=?  WHERE id = ?;';
    const queryParam = [deadline,todo,id];
    await conn.execute(queryString, queryParam);
} 
exports.GetUserList = async (conn) =>{
    const queryString = `SELECT id,userid,name,description FROM user ;`;
    let [UserList,]  = await conn.query(queryString);
    let result=[]; 
    UserList.forEach((data) =>{
        result.push(retnUserData(data.id,data.userid,data.name,data.description));
    });
    console.log(result);
    return result;
}

exports.SetProject = async (conn, projectid, name, description, deadline, language) => {
    {//프로젝트 수정
        const queryString = `UPDATE project SET name=?, description=?,deadline=? WHERE id =? ;`;
        const queryParam = [name, description, deadline, projectid];
        await conn.execute(queryString, queryParam);
    }
    {//삭제
        const queryString = `DELETE FROM language_project WHERE projectid = ?;`;
        const queryParam = [projectid]
        await conn.execute(queryString, queryParam);
    }
    {//프로젝트 언어 수정
        
        for(let item of language){
            const queryString = `INSERT INTO language_project(projectid,languageid) VALUES (?,?);`;
            const queryParam = [projectid,item];
            await conn.execute(queryString, queryParam);
        }
    }

}