@ ECHO OFF
SETLOCAL
CLS

::mysql과 서버를 함께 실행하도록 하는 배치
::해당 배치를 실행하기 전, Server/config.js 파일을
::모두 작성했는지 확인해봅시다.
::
::본 배치의 기본적인 접두어 설명입니다.
::L_ : 라벨
::
::배치 파일은 기본적으로 mysql 설치와 Server/config.js 파일을
::모두 작성했는지 묻고 시작합니다.
::만일 mysql 설치와 Server/config.js 파일의 설정이
::모두 끝났으며, 본 배치파일 실행과 동시에 즉각적인
::시작을 원한다면 아래 FAST_START 의 값을 1로 수정하기 바랍니다.
set FAST_START=0


IF %FAST_START%==1 (
    GOTO L_FAST_START
) ELSE (
    GOTO L_SLOW_START
)

:L_FAST_START

ECHO "안내 없이 서버를 실행합니다."

GOTO L_EOF
:L_SLOW_START


:L_REQ_MYSQL
ECHO 안내와 함께 시작합니다.
ECHO 만일 안내 없이 실행하고자 한다면 배치 파일에서
ECHO FAST_START 값을 1로 수정해주시면 됩니다.
ECHO.

ECHO 한가지 질문합니다. mysql을 설치하셨나요?
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
        ECHO 실행 전에 mysql을 설치해주세요.
        ECHO 잠시 후 MYSQL 페이지를 엽니다.
        TIMEOUT 3
        START https://www.mysql.com/
        GOTO L_EOF
    )
)
:L_PASS_MYSQL
ECHO mysql을 설치했다고 답하셨습니다.
ECHO.
ECHO Server/config.js 파일의 작성을 완료했나요?
ECHO.

set /p IS_CONFIG=작성완료(Y/N):
CLS

:: 파일
IF NOT "%IS_CONFIG%"=="Y" (
    IF NOT "%IS_CONFIG%"=="y" (
        IF NOT "%IS_CONFIG%"=="N" (
            IF NOT "%IS_CONFIG%"=="n" (
                GOTO L_PASS_MYSQL
            )
        )

        ECHO Server/config.js 파일의 작성을 완료해주세요.
        ECHO 잠시 후 Server/config.js 파일을 엽니다.
        ECHO 파일 선택 메뉴가 나오더라도 놀라지마세요.
        TIMEOUT 3
        IF EXIST "Server\config.js" (
            START Server\config.js
        ) ELSE (
            ECHO Server/config.js 파일이 존재하지 않습니다.
            ECHO 패키지를 다시 다운로드하세요.

        )

        GOTO L_EOF
        
    )
)

:: 여기에 데이터베이스 및 웹서버 실행 코드를 작성하면 됩니다.
:: 데이터베이스 실행 - 웹서버 실행 순으로 진행
:: 각 실행 과정에서 안정성을 위해 딜레이를 두고 실행할 것.


GOTO L_EOF
:L_EOF
CLS
ECHO 서버 실행 배치를 종료합니다.
TIMEOUT 3

ENDLOCAL