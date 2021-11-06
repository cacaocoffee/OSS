// https://t-anb.tistory.com/53
const mysql = require('mysql2/promise');
const fs = require('fs');
const si = require('systeminformation');
const sec = require('./security');

exports.pool = async () => {
    let dbPool;
    const Initialize = async _ => {
        const baseboard = await si.baseboard();
        let config = await fs.readFileSync("./config.json", "utf-8", _ => { });
        config = JSON.parse(config);

        config.connectionLimit = 30;
        config.password = sec.Decrypt(config.password, sec.HashFor2Way(baseboard.serial));

        return await mysql.createPool(config);
    };

    if (!dbPool) {
        dbPool = await Initialize();
        return dbPool;
    }
    return dbPool;
};


