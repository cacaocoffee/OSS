/* 해당 파일은 installation 영역과 겹치지 않도록 주의하세요.
//
//
*/
const fs = require('fs');

exports.config = JSON.parse(fs.readFileSync('./config.json', "utf-8", () =>{}));
