var express = require('express');
var maria = require('mysql');
var userdb = require('./config').config_db;

var conn = maria.createConnection({
        host:userdb.host,
        user:userdb.user,
        password:userdb.password
    }
);

conn.connect(function(err){
    if(err) throw err;

    conn.query(`CREATE DATABASE IF NOT EXISTS ${userdb.database};`, function(err, result){
        if(err) throw err;

        console.log(`CREATE DATABASE ${userdb.database}:` + result);
        
    });
});

module.exports = conn;
