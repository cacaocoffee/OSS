// https://t-anb.tistory.com/53
const sec = require('./security');
const tools = require('./tools');

const mysql2 = require('mysql2/promise');

exports.pool = _ => {
    let dbPool = undefined;
    const Initialize = _ => {
        let config = this.config;
        config.connectionLimit = 30;
        
        return dbPool = mysql2.createPool(config);
    };

    if (!dbPool) {
        Initialize();
    }

    
    return dbPool;
};


const temp = tools.config;
temp.db.password = sec.Decrypt(temp.db.password, sec.HashFor2Way(tools.config.serial));

exports.config = temp.db;