

exports.existsID = async (conn, id) =>{
    try{
        const queryString = 'SELECT * FROM ?? WHERE ?? = ?;';
        const queryParam = ['user', 'userid', id];
    
        const [result, ] = await conn.query(queryString, queryParam);
        if(result[0]) return 1;
        return 0;
    }catch(e){
        return -1;
    }
}

exports.pageUseAuthorize = async (conn, req) =>{
    if(!req.session.user) return false;
    
    return true;
}