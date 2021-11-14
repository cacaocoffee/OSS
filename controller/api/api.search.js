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

function retnTodoData(toid,deadline,cleardate,done,todo){
    return {
        id:toid,
        deadline:deadline,
        cleardate:cleardate,
        done:done,
        todo:todo,
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


exports.GetProjectList = async (conn) =>{
    let [getList, ] = await conn.execute('SELECT * FROM project;');
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
    let [listFromProjUser, ] = await conn.execute(queryString, queryParam);

    for(let item of listFromProjUser){
        const queryString = 'SELECT * FROM project WHERE id = ?;';
        const queryParam = [item.projectid];
        let [listFromProj, ] = await conn.execute(queryString, queryParam);
        for(let project of listFromProj){
            result.push(retnProjectData(project.id, project.name, project.description, project.deadline));
        }
    }
    console.log(result);
    return result;

}


exports.GetUserTodolist = async (conn, userid) =>{
    const queryString = 'SELECT * FROM todo_user WHERE userid = ?;';
    const queryParam = [userid];
    let [listFromTodo, ] = await conn.execute(queryString, queryParam);
    let result = [];
    for(let item of listFromTodo){
        const queryString = 'SELECT * FROM todo WHERE id = ?;';
        const queryParam = [item.userid];
        let [todolist] = await conn.execute(queryString, queryParam);
        todolist.forEach((data) =>{
            result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.done,data.todo));
        });
    };
    return result;
}

exports.GetTodolist = async (conn) =>{
    let [todolist, ] = await conn.execute('SELECT * FROM todo;');
    let result = [];

    todolist.forEach((data) =>{
        result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.done,data.todo));
    });
    return result;
}
