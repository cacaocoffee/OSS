exports.existsID = async (conn, id) =>{
    try{
        const queryString = 'SELECT * FROM user WHERE userid = ?;';
        const queryParam = [id];
    
        const [result, ] = await conn.execute(queryString, queryParam);
        if(result[0]) return 1;
        return 0;
    }catch(e){
        return -1;
    }
}

exports.pageUseAuthorize = async (conn, req) =>{
    // 페이지 권한
    if(!req.session.user) return false;
    
    return true;
}
exports.isLogined = (req) =>{
    // 로그인 여부
    if(!req.session) return false;
    if(!req.session.user) return false;

    return true;
}

exports.GetUserInfo = async (conn, id) =>{
    let queryString = 'SELECT * FROM user WHERE id = ? LIMIT 1;';
    let queryParam = [id];

    let [result, ] = await conn.execute(queryString, queryParam);

    return result[0];
}