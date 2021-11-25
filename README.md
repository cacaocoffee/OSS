8조 말 많은 양의 왕
===
소규모 집단 내에서 스터디/토이 프로젝트를 진행함에서 있어 팀원간 자기 할 일 및 진척 사항 등을 관리할 수 있는 웹 서비스 기반 프로그램.
 
 Index
 ---
 * [참여자](#참여자)
 * [개발 환경](#개발-환경)
 * [실행 방법](#실행-방법)
 * [실행 결과](#demonstrate)
 * [DB](#database)



## 참여자
<a href="https://github.com/cacaocoffee" ><img style="width:150px" src="https://avatars.githubusercontent.com/u/75840431?v=4" /></a>
<a href="https://github.com/mijien0179"  ><img style="width:150px" src="https://avatars.githubusercontent.com/u/40613626?v=4" /></a>
<a href="https://github.com/c0c0pang"    ><img style="width:150px" src="https://avatars.githubusercontent.com/u/91197026?v=4" /></a>
<a href="https://github.com/hyunjin0311" ><img style="width:150px" src="https://avatars.githubusercontent.com/u/91197248?v=4" /></a>

## 개발 환경
* Node.js v16.13.0 LTS
* MariaDB v10.6.5 / MySQL v8.0.27
* Windows 10 v21H1 (OS Build 19043.1348)

## 실행 방법
다음의 두 가지 방법으로 서버를 실행할 수 있습니다.
1. [배치파일 이용](#배치파일-이용)
2. [명령창 이용](#명령창-이용)

### 배치파일 이용

해당 방법은 ***Windows의 지역설정이 한국***이며 ***언어 설정이 한국어***인 경우 사용 가능합니다.

레포지토리를 다운로드한 뒤, 해당 파일을 압축 해제하면 아래와 같은 배치파일을 실행합니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143385640-ce8f72f8-2fa6-4e6e-9885-1c1aa3b294a4.png" style="width:500px"/>
 
MySQL 설치 확인 안내에서 Y/y를 입력 후, Node.js 설치 확인 안내에서 Y/y를 입력해 다음으로 진행합니다.
<img src="https://user-images.githubusercontent.com/40613626/143385784-394e728d-ce37-4ece-ae4a-c6f72b6f30c7.png" style="width:450px"/> 
<img src="https://user-images.githubusercontent.com/40613626/143385848-fe678030-50a1-4908-97c5-5cd3291f7826.png" style="width:450px"/>

이제 [웹 서비스 설정](#웹-서비스-설정)으로 이동합니다.

### 명령창 이용

제공되는 배치파일을 이용할 수 없을 때 사용합니다.

레포지토리를 다운로드한 뒤, 압축 해제한 폴더에서 `Shift` + `마우스 오른쪽 버튼`을 클릭하면 나오는 컨텍스트 메뉴에서 `여기에 PowerShell 창 열기`를 클릭합니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143387940-701d3f4d-c2be-40ae-a182-612c7f414659.png" style="width:450px"/>

명령창에서 `npm install` 명령을 입력해 필요한 모듈을 다운로드합니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143388196-b980379c-283e-4d73-850d-5e0cae69fb98.png" style="width:450px"/>

문제가 없으면 `npm start` 명령을 이용해 서버를 실행시킵니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143388352-6ebcd354-857f-4656-b701-17d6110350a5.png" style="width:450px"/>

### 웹 서비스 설정

웹 브라우저에서 `http://localhost:3000`을 입력 후 데이터베이스 정보를 입력합니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143387294-06d9d974-9d09-4009-8f5f-8d19afac5014.png" style="width:450px"/>

아래의 결과가 나오면 설치가 성공적으로 이루어진것입니다.<br>
<img src="https://user-images.githubusercontent.com/40613626/143388729-1fdefd71-286f-47d2-82f1-022ce38c5f05.png" style="width:450px"/>


 ---

## demonstrate
[시연 문서](./demonstrate.md)
## database
[데이터베이스 문서](./DataBase.md)
