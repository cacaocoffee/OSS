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

exports.validID = async (id) =>{
    const exp = new RegExp(`([A-Za-z0-9]*)`);
    id = id || '';
    if(id.length <= 0) return false;
    let ret = exp.exec(id);
    
    if( ret[1] == id) return true;
    else return false;
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