exports.GetLanguageList = (conn) =>{
    let [getList, ] = await conn.query('SELECT * FROM language_list;');
    let result = [
        {
            label:'',
            id:0,
            value:''
        }
    ]

    // result = [];

    getList.forEach((id, lang) =>{
        result.push({
            label:lang.toString().toLowerCase(),
            id:id,
            value:lang.toString()
        });
    })

    return result;
}