function retnLangData(langid, langText){
    return {
        label:langText.toLowerCase(),
        id:langid,
        value:langText
    };
}

function retnTodoData(toid,daedline,cleardate,done,todo){
    return {
        id:toid,
        daedline:daedline,
        cleardate:cleardate,
        do:done,
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
            result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.do,data.todo));
        });
    };
    return result;
}


exports.GetTodolist = async (conn) =>{
    let [todolist, ] = await conn.query('SELECT * FROM todo;');
    let result = [];

    todolist.forEach((data) =>{
        result.push(retnTodoData(data.id,data.deadline,data.cleardate,data.do,data.todo));
    });
    return result;
}
