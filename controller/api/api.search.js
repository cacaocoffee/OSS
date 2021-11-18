function retnLangData(langid, langText){
    return {
        label:langText.toLowerCase(),
        id:langid,
        value:langText
    };
}
function retnProjectData(id, name, desc, deadline){
    return {
        'id': id,
        'name': name,
        'desc': desc,
        'deadline':deadline
    }
}
function retnProjectInfoData(project, userlist,langlist){
    project.userlist = userlist;
    project.langlist = langlist;
    return project;
}

function retnUserData(id, userid,name){
    return {
        'id' : id,
        'userid': userid,
        'name':name
    };
}
function retnTodoData(toid,deadline,cleardate,done,todo){
    return {
        id:toid,
        deadline:daedline,
        cleardate:cleardate,
        done:done,
        todo:todo,
    };
}

exports.GetLanguageList = async (conn) =>{
    let [getList, ] = await conn.query('SELECT * FROM language_list;');
    let result = [];

    getList.forEach((data) =>{
        result.push(retnLangData(data.id, data.language));
    });

    return result;
}

exports.GetUserLanguageList = async (conn, userid) =>{
    const queryString = 'SELECT * FROM language_user WHERE userid = ?;';
    const queryParam = [userid];
    let [listFromLangUser, ] = await conn.query(queryString, queryParam);
    let result = [];
    
    for(let item of listFromLangUser){
        const queryString = 'SELECT language FROM language_list WHERE id = ?;';
        const queryParam = [item.language];
        
        let [listFromLangList,] = await conn.query(queryString, queryParam);

        result.push(retnLangData(item.language, listFromLangList[0].language));
    };

    return result;
}


exports.GetProjectList = async (conn) =>{
    let [getList, ] = await conn.query('SELECT * FROM project;');
    let result = [];

    getList.forEach((project) =>{
        result.push(retnProjectData(project.id, project.name, project.description, project.deadline));
    })

    return result;    
}

exports.GetUserProjectList = async (conn, userid) =>{
    const queryString = 'SELECT projectid FROM project_user WHERE userid = ?;';
    const queryParam = [userid];
    let result = [];
    let [listFromProjUser, ] = await conn.query(queryString, queryParam);

    for(let item of listFromProjUser){
        const queryString = 'SELECT * FROM project WHERE id = ?;';
        const queryParam = [item.projectid];
        let [listFromProj, ] = await conn.query(queryString, queryParam);
        for(let project of listFromProj){
            result.push(retnProjectData(project.id, project.name, project.description, project.deadline));
        }
    }
    return result;

}
exports.GetProjectLanguageList = async (conn, projectid) =>{
    const queryString = 'SELECT * FROM language_project WHERE projectid = ?;';
    const queryParam = [projectid];
    let [listFromLangProj, ] = await conn.query(queryString, queryParam);
    let result = [];
    console.log(listFromLangProj);
    for(let item of listFromLangProj){
        console.log(item);
        const queryString = 'SELECT language FROM language_list WHERE id = ?;';
        const queryParam = [item.languageid];
        let [listFromLangList,] = await conn.query(queryString, queryParam);
        console.log(listFromLangList);
        result.push(retnLangData(item.language, listFromLangList[0].language));
    };
    return result;
}

exports.GetProject = async (conn,projectid) =>{
    const queryString = 'SELECT * FROM project WHERE id = ?;';
    const queryParam = [projectid];
    let [project, ] = await conn.query(queryString, queryParam);

    let result;
    let project_userlist= await this.GetUserProjectList(conn,projectid);
    let project_langlist= await this.GetProjectLanguageList(conn,projectid);

    result = retnProjectInfoData(
        retnProjectData(project[0].id, project[0].name, project[0].description, project[0].deadline), 
        project_userlist, 
        project_langlist
    );
    console.log(result);
    return result;
}


exports.GetUserTodolist = async (conn, userid) =>{
    const queryString = 'SELECT * FROM todo_user WHERE userid = ?;';
    const queryParam = [userid];
    let [listFromTodo, ] = await conn.query(queryString, queryParam);
    let result = [];
    for(let item of listFromTodo){
        const queryString = 'SELECT * FROM todo WHERE id = ?;';
        const queryParam = [item.userid];
        let [todolist] = await conn.query(queryString, queryParam);
        todolist.forEach((data) =>{
            result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.done,data.todo));
        });
    };
    return result;
}


exports.GetTodolist = async (conn) =>{
    let [todolist, ] = await conn.query('SELECT * FROM todo;');
    let result = [];
    todolist.forEach((data) =>{
        result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.done,data.todo));
    });
    return result;
}
