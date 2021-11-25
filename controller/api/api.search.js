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
function retnTodoData(todoId,deadline,todo){
    return {
        id:todoId,
        deadline:deadline,
        todo:todo,
    };
}
function retnUserTodoData(userid,todoData,projectid,overwrite,done,cleardate){
    return {
        'userid':userid,
        'data':todoData,
        'projectid':projectid,
        'overwrite':overwrite,
        'done':done,
        'cleardate':cleardate
    };
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

exports.GetTodoData = async (conn, todoid) =>{
    let [result, ] = await conn.execute(`SELECT * FROM todo WHERE id = ?;`, [todoid]);
    return retnTodoData(result.id, result.deadline, result.todo);
}

exports.GetSharedTodo = async (conn,userid) =>{
    let result = [];
    const projectList = await this.GetUserProjectList(conn, userid);
    
    for(let project of projectList){
        const queryString = 'SELECT * FROM todo_user WHERE projectid = ? AND overwrite = 1;';
        const queryParam = [project.id];

        const [todoList, ] = await conn.execute(queryString, queryParam);
        for(let todo of todoList){
            let todoData = await this.GetTodoData(conn, todo.todoid);
            result.push(retnUserTodoData(
                todo.userid,
                todoData,
                todo.projectid,
                todo.overwrite,
                todo.doen,
                todo.cleardate
            ));
        }
    }
    return result;
}

exports.GetMyTodo = async (conn, userid) =>{
    const queryString = 'SELECT * FROM todo_user WHERE userid = ?;';
    const queryParam = [userid];
    let [todoUser, ] = await conn.execute(queryString, queryParam);

    let result = []

    for(let todo of todoUser){
        let [todoData, ] = await conn.execute(`SELECT * FROM todo WHERE id = ?;`, [todo.todoid]);
        result.push(retnUserTodoData(
            todo.userid,
            retnTodoData(todoData[0].id,todoData[0].deadline, todoData[0].todo),
            todo.projectid,
            todo.overwrite,
            todo.done,
            todo.cleardate
        ));
    }
    
    return result;
}

exports.SetTodo = async (conn, todoText, overwrite, deadline, userList, projectid) =>{
    let queryString = `INSERT INTO todo(deadline, todo) VALUES(?, ?);`;
    let queryParam = [deadline, todoText];
    const [todo, ] = await conn.execute(queryString, queryParam);
    
    if(! 'insertId' in todo){
        return false;
    }
    
    const addTodo = async (c, userid, todoid, projectid, overwrite) =>{
        const queryString = `INSERT INTO todo_user(userid, todoid, projectid, overwrite) VALUES(?,?,?,?);`;
        const queryParam = [userid, todoid, projectid, overwrite];
        let result = await c.execute(queryString, queryParam);
        console.log(result);
    }

    if(overwrite){
        console.log(123);
        addTodo(conn, userList[0], todo.insertId, projectid, overwrite);
    }else{
        console.log(1233123);
        for(let user of userList) addTodo(conn, user, todo.insertId, projectid, overwrite);
    }
}

exports.UpdateTodo = async (conn,id,deadline,todo) => {
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
    return result;
}

exports.SetProject = async (conn, projectid, name, description, deadline, language) => {
    {//프로젝트 수정
        const queryString = `UPDATE project SET name=?, description=?,deadline=? WHERE id =? ;`;
        const queryParam = [name, description, deadline, projectid];
        await conn.execute(queryString, queryParam);
    }
    {// 언어 목록 삭제 삭제
        const queryString = `DELETE FROM language_project WHERE projectid = ?;`;
        const queryParam = [projectid]
        await conn.execute(queryString, queryParam);
    }
    {// 언어 목록 재등록
        
        for(let item of language){
            const queryString = `INSERT INTO language_project(projectid,languageid) VALUES (?,?);`;
            const queryParam = [projectid,item];
            await conn.execute(queryString, queryParam);
        }
    }
}

// language = Array(projectid: int)
exports.GetUserListWithLanguage = async(conn,language) =>{
    const q = `SELECT id FROM user;`;
    let [userid, ]= await conn.execute(q);
    let result = [];
    userid.forEach(data => {
        result.push(data.id);        
    });
    //전체 유저의 userid 가져옴
    if(!(Array.isArray(language) && language.length === 0)){
        for(let item of language){
            const queryString = `SELECT userid FROM language_user WHERE language = ? ;`;
            const queryParam = [item];
            
            // 언어별 사용자 리스트
            let [langUserList, ]= await conn.query(queryString, queryParam);
            let temp = []; // 사용자 리스트 배열
            let arr = []; // white list;
            langUserList.forEach(data => temp.push(data.userid));
            
            for(let val of temp) {
                iTemp = result.findIndex((elt) => {return elt == val});
                if(0 <= iTemp) arr.push(result[iTemp]);
            }
            result = arr;
        }
    }
    let retn=[];
    for(let item of result)
    {
        const queryString = `SELECT id,userid,name,description FROM user WHERE id=?;`
        const queryParam = [item];
        let [UserList,] = await conn.execute(queryString, queryParam);
        if(UserList.length != 0){
            retn.push(retnUserData(UserList[0].id,UserList[0].userid,UserList[0].name,UserList[0].description))
        }
    }
    return retn;
}