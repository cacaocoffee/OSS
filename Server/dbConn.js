var express = require('express');
var maria = require('mysql');
const sec = require('./security');
const si = require('systeminformation');
const fs = require('fs');

let userdb = fs.readFileSync("./config.json", "utf-8", function(err){});
userdb = JSON.parse(userdb);
let conn;
si.baseboard(el =>{

     conn = maria.createConnection({
            host:userdb.host,
            user:userdb.user,
            password: sec.Decrypt(userdb.password, sec.Hash(el.serial)),
            database:"teamoss"
        }
    );

    conn.connect();
});



module.exports = conn;
