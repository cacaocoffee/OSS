const apiCommon = require('./api/api.common');
const apiAuth = require('./api/api.auth');
const apiSearch = require('./api/api.search');
const db = require('../Server/dbConn');
const sitesubstitute = require('../Server/config').config_site;

exports.getProfileDetail = async (req, res, next) =>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection();
        try{

            const findId = req.query.userid || null;
            if(!findId) return res.redirect(req.baseUrl);

            let userInfo = await apiAuth.GetUserInfo(connection, req.session.user);

            let findUserInfo = await apiAuth.GetUserInfo(connection, findId);
            let findUserLanguage;
            let findUserProject;
            findUserInfo = findUserInfo || null;

            if(findUserInfo){
                findUserLanguage = await apiSearch.GetUserLanguageList(connection, findUserInfo.id);
                findUserProject = await apiSearch.GetUserProjectList(connection, findUserInfo.id);
            }

            res.render('layout', apiCommon.renderData(
                'profile-detail',
                ['index', 'profile_detail'],
                ['script'],
                {
                    user: userInfo,
                    findUser: findUserInfo && {
                        user: findUserInfo,
                        language: findUserLanguage,
                        project: findUserProject
                    }
                }
            ));

        }catch(e){
            console.log(e);
            return res.redirect(req.baseUrl);
        }finally{
            await connection.release();
        }
    }catch(e){
        console.log(e);
        return res.status(500).end();
    }
}

exports.getProfileList = async (req,res,next) =>{
    if(! await apiAuth.isLogined(req)) return res.redirect('/');

    try{
        const pool = await db.pool();
        const connection = await pool.getConnection(async conn => conn);
        try{
            const peopleCount = 30; // 한 번에 가져올 데이터 수
            const page = req.query.page || 0;
            const limitStart = peopleCount * page;
            // 검색 새작할 위치

            const loginedUser = await apiAuth.GetUserInfo(connection, req.session.user);
            const language = await apiSearch.GetLanguageList(connection);
            // const userList;

            return res.render('layout', apiCommon.renderData(
                'profile',
                ['profile', 'form'],
                ['script'],
                {
                    user: loginedUser,
                    language: language
                }
            ));

        }catch(e){
            return res.redirect(req.baseUrl);
        }finally{
            await connection.release();
        }
    }catch(e){
        console.log(e);
        return res.redirect(req.baseUrl);
    }
}
