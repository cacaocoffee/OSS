@ ECHO OFF
SETLOCAL
CLS

::MySQL �� Node.js�� ��� ��ġ�Ǿ��ִ��� Ȯ���غ��ô�.
::
::�� ��ġ�� �⺻���� ���ξ� �����Դϴ�.
::L_ : ��
::
::��ġ ������ �⺻������ MySQL�� Node.js�� ��ġ�� Ȯ���մϴ�.
::��� �ۼ��ߴ��� ���� �����մϴ�.
::���� MySQL, Node.js ��ġ�� ��� ��������
::�� ��ġ���� ����� ���ÿ� �ﰢ����
::������ ���Ѵٸ� �Ʒ� FAST_START �� ���� 1�� �����ϱ� �ٶ��ϴ�.
set FAST_START=0


IF %FAST_START%==1 (
    GOTO L_FAST_START
) ELSE (
    GOTO L_SLOW_START
)

:L_FAST_START

ECHO �ȳ� ���� ������ �����մϴ�.

GOTO L_SERVER_START
:L_SLOW_START


:L_REQ_MYSQL
ECHO �ȳ��� �Բ� �����մϴ�.
ECHO ���� �ȳ� ���� �����ϰ��� �Ѵٸ� ��ġ ���Ͽ���
ECHO FAST_START ���� 1�� �������ֽø� �˴ϴ�.
ECHO.

ECHO MySQL�� ��ġ�ϼ̳���?
ECHO.
set /p IS_MYSQL=��ġ(Y/N):
CLS

IF NOT "%IS_MYSQL%"=="Y" (
    IF NOT "%IS_MYSQL%"=="y" (
        IF NOT "%IS_MYSQL%"=="N" (
            IF NOT "%IS_MYSQL%"=="n" (
                GOTO L_REQ_MYSQL
            )
        )
        ECHO ���� ���� MySQL�� ��ġ���ּ���.
        ECHO ��� �� MySQL �������� ���ϴ�.
        TIMEOUT 3
        START https://www.mysql.com/
        GOTO L_EOF
    )
)
:L_PASS_MYSQL
ECHO MySQL�� ��ġ�ߴٰ� ���ϼ̽��ϴ�.
ECHO.
ECHO Node.js�� ��ġ�߳���?
ECHO.

set /p IS_NODEJS=�ۼ��Ϸ�(Y/N):
CLS

:: ����
IF NOT "%IS_NODEJS%"=="Y" (
    IF NOT "%IS_NODEJS%"=="y" (
        IF NOT "%IS_NODEJS%"=="N" (
            IF NOT "%IS_NODEJS%"=="n" (
                GOTO L_PASS_MYSQL
            )
        )

        ECHO Node.js�� ��ġ���ּ���.
        START https://nodejs.org/ko/download/
        GOTO L_EOF
        
    )
)


:L_SERVER_START

:: DB�� ���� ������ �ʿ� ����

ECHO Node.js �� ������ �����մϴ�.

IF NOT EXIST "./bin/www" (
    ECHO ������ ���� ����� �������� ���߽��ϴ�.
    ECHO �ٽ� �ٿ�ε��ϼ���.
    TIMEOUT 3
    GOTO L_EOF
)

IF NOT EXIST "./node_modules" (
    ECHO.
    ECHO ���Ӽ� ����� �����ϴ�.
    ECHO ���Ӽ� ����� �ٿ�ε� �մϴ�.
    ECHO.
    CALL npm install
    ECHO.
    ECHO ���� �����
    TIMEOUT 1
)

npm start


GOTO L_EOF
:L_EOF
ECHO ���� ���� ��ġ�� �����մϴ�.
TIMEOUT 3

ENDLOCAL