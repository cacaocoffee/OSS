function retnLangData(langid, langText){
    return {
        label:langText.toLowerCase(),
        id:langid,
        value:langText
    };
}

function retnProjectData(id, name, desc, deadline, uselang){
    return {
        'id': id,
        'name': name,
        'desc': desc,
        'deadline':deadline,
        'language':uselang
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
        result.push(retnProjectData(project.id, project.name, project.description, project.deadline, project.uselanguage));
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
            result.push(retnProjectData(project.id, project.name, project.description, project.deadline, project.uselanguage));
        }
    }

    console.log(result);
    return result;

}