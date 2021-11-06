

exports.existsID = async (conn, id) =>{
    const queryString = 'SELECT * FROM ?? WHERE ?? = ?;';
    const queryParam = ['user', 'id', id];

    const [result, ] = await conn.query(queryString, queryParam);
    if(result[0]) return true;
    return false;
}