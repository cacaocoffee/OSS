/* 본 파일은 서버 프로그램에서 사용하면서 운영자/운영그룹에 따라
// 달라질 수 있는 부분을 설정하는 파일입니다.
//
// 서버에서 사용하는 모든 사용자 설정 파일은 이곳에서 불러와
// 사용합니다.
//
///////////////////////////////////////////////////////////////////
//
// 본 파일에서 export 할때는
// config_
// 를 접두사로 붙이기 바랍니다.
//
//
//
//
/////////////////////////////////////////////////////////////////*/
const fs = require('fs')

exports.version = {
    major:0,
    minor:1,
    patch:0
};

exports.config_server = {
    port: 3000              // 서버 실행시 사용할 포트 번호
    
}

const temp = JSON.parse(fs.readFileSync('./config.json', "utf-8", () =>{}));

exports.config = temp;

/* admin */
