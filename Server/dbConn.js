// https://t-anb.tistory.com/53
const sec = require('./security');
const conf = require('./config');

const express = require('express');
const mysql2 = require('mysql2/promise');
const fs = require('fs');

const app  = express();
    
// exports.sessionStore = (connection) =>{
//     let sessionStore;
    
//     const InitializeSessionStore = _ => {
//         sessionStore = new MySQLStore({}, connection);
//         return sessionStore;
//     }
    
//     if(!sessionStore) return sessionStore = InitializeSessionStore();
//     return sessionStore;
// }

exports.pool = _ => {
    let dbPool = undefined;
    const Initialize = _ => {
        let config = this.config;
        config.connectionLimit = 10;
        
        return dbPool = mysql2.createPool(config);
    };

    if (!dbPool) {
        Initialize();
    }

    
    return dbPool;
};


const temp = conf.config;
temp.db.password = sec.Decrypt(temp.db.password, sec.HashFor2Way(conf.config.serial));

exports.config = temp.db;