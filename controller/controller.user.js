const apiCommon = require('./api/api.common');
const apiAuth = require('./api/api.auth');
const apiSearch = require('./api/api.search');
const db = require('../Server/dbConn');
const sitesubstitute = require('../Server/config').config_site;

exports.getProfile = async (req, res, next) =>{
    if(! await apiAuth.isLogined(req)) {
        console.log('not login');
        return res.redirect('/');
    }
    try{
        const pool = await db.pool();
        const connection = await pool.getConnection();
        try{

            const findId = req.query.userid || null;
            if(!findId) return res.redirect('/');

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
            return res.status(500).end();
        }
    }catch(e){
        console.log(e);
        return res.status(500).end();
    }
}