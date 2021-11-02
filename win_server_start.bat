@ ECHO OFF
SETLOCAL
CLS

::MySQL 및 Node.js가 모두 설치되어있는지 확인해봅시다.
::
::본 배치의 기본적인 접두어 설명입니다.
::L_ : 라벨
::
::배치 파일은 기본적으로 MySQL과 Node.js의 설치를 확인합니다.
::모두 작성했는지 묻고 시작합니다.
::만일 MySQL, Node.js 설치가 모두 끝났으며
::본 배치파일 실행과 동시에 즉각적인
::시작을 원한다면 아래 FAST_START 의 값을 1로 수정하기 바랍니다.
set FAST_START=0


IF %FAST_START%==1 (
    GOTO L_FAST_START
) ELSE (
    GOTO L_SLOW_START
)

:L_FAST_START

ECHO 안내 없이 서버를 실행합니다.

GOTO L_SERVER_START
:L_SLOW_START


:L_REQ_MYSQL
ECHO 안내와 함께 시작합니다.
ECHO 만일 안내 없이 실행하고자 한다면 배치 파일에서
ECHO FAST_START 값을 1로 수정해주시면 됩니다.
ECHO.

ECHO MySQL을 설치하셨나요?
ECHO.
set /p IS_MYSQL=설치(Y/N):
CLS

IF NOT "%IS_MYSQL%"=="Y" (
    IF NOT "%IS_MYSQL%"=="y" (
        IF NOT "%IS_MYSQL%"=="N" (
            IF NOT "%IS_MYSQL%"=="n" (
                GOTO L_REQ_MYSQL
            )
        )
        ECHO 실행 전에 MySQL을 설치해주세요.
        ECHO 잠시 후 MySQL 페이지를 엽니다.
        TIMEOUT 3
        START https://www.mysql.com/
        GOTO L_EOF
    )
)
:L_PASS_MYSQL
ECHO MySQL을 설치했다고 답하셨습니다.
ECHO.
ECHO Node.js를 설치했나요?
ECHO.

set /p IS_NODEJS=작성완료(Y/N):
CLS

:: 파일
IF NOT "%IS_NODEJS%"=="Y" (
    IF NOT "%IS_NODEJS%"=="y" (
        IF NOT "%IS_NODEJS%"=="N" (
            IF NOT "%IS_NODEJS%"=="n" (
                GOTO L_PASS_MYSQL
            )
        )

        ECHO Node.js를 설치해주세요.
        START https://nodejs.org/ko/download/
        GOTO L_EOF
        
    )
)


:L_SERVER_START

:: DB는 따로 실행할 필요 없음

ECHO Node.js 웹 서버를 실행합니다.

IF NOT EXIST "./bin/www" (
    ECHO 파일이 없어 제대로 시작하지 못했습니다.
    ECHO 다시 다운로드하세요.
    TIMEOUT 3
    GOTO L_EOF
)

IF NOT EXIST "./node_modules" (
    ECHO.
    ECHO 종속성 모듈이 없습니다.
    ECHO 종속성 모듈을 다운로드 합니다.
    ECHO.
    CALL npm install
    ECHO.
    ECHO 실행 대기중
    TIMEOUT 1
)

npm start


GOTO L_EOF
:L_EOF
ECHO 서버 실행 배치를 종료합니다.
TIMEOUT 3

ENDLOCAL