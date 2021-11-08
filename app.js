var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var app = express();

const session = require('express-session');
const MYSQLStore = require('express-mysql-session')(session);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // body-parser
// 라우터 바인딩은 app에서 분리
// TODO: install 페이지 체크를 무엇으로 할지 논의 필요

if (fs.existsSync("./config.json")) {
    const db = require('./Server/dbConn');
    const storeConfig = {
        host:db.config.host,
        user:db.config.user,
        password:db.config.password,
        database:db.config.database,
        connectionLimit:30
    }
    
    app.use(session({
        httoOnly:true,
        secure:true,
        key: 'test',
        secret: 'secret',
        store: new MYSQLStore(storeConfig),
        resave: false,
        saveUninitialized: false,
        cookie:{
            httpOnly:true,
            Secure:true
        }
    }));

    const routersList = require('./routes/_routerCtrl');
    app.use(routersList);

} else {
    const installRouter = require('./routes/install');
    app.use(installRouter);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
