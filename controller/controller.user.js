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

            const id = req.query.userid || null;

            if(!id) return res.redirect('/');
            
            if(req.session.user != id){
                return res.render('layout', apiCommon.renderData(
                    'profile', ['glass', 'index'], null, {
                        user:null
                    }
                ));
            }

            res.render('layout', apiCommon.renderData(
                'profile', ['glass', 'index'], null,{
                    user:await apiAuth.GetUserInfo(connection, id)
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