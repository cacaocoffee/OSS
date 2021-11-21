const siteConf = require('../../Server/config').config_site;

exports.renderData = (mainContent, cssList, scriptList, data) =>{
    let result = {
        'content':mainContent,
        'site_title':siteConf.title,
        css:cssList,
        js:scriptList,
        'data' : data || null
    };
    return result;

}

