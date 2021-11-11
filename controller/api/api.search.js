function retnLangData(langid, langText){
    return {
        label:langText.toLowerCase(),
        id:langid,
        value:langText
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