8조 말 많은 양의 왕
===
소규모 집단 내에서 스터디/토이 프로젝트를 진행함에서 있어 팀원간 자기 할 일 및 진척 사항 등을 관리할 수 있는 웹 서비스 기반 프로그램.
 
 Index
 ---
 * [참여자](#참여자)
 * [개발 환경](#개발-환경)
 * [실행 방법](#실행-방법)



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

### 로그인 페이지

<img width="428" alt="로그인" src="https://user-images.githubusercontent.com/91197026/143182994-9d9e32b5-817d-4940-9c04-7331b81fca6a.png">

먼저 사용자가 아이디를 등록했다면 아이디와 비밀번호를 입력하여 로그인 하면 프로젝트 메인 페이지가 나온다.
만약에 아이디가 없다면 회원가입을 누르면 된다.

<img width="394" alt="회원가입" src="https://user-images.githubusercontent.com/91197026/143183647-f16cda17-1cf7-4956-a683-29105eb4868f.png">

가입할 아이디를 입력한 뒤 ID확인 버튼으로 중복이 되는지 확인하며 사용자가 다룰 수 있는 언어/스택을 선택한 다음에 회원가입을 하면 끝이난다.
 
 ---
### 메인 페이지

<img width="699" alt="프로젝트 메인" src="https://user-images.githubusercontent.com/91197026/143185738-8569ddcb-77bd-47b9-adc2-da48497dfbf3.png">

로그인을 하면 메인 페이지로 넘어가게 된다. 

헤더의 기능은 자신의 닉네임을 누르면 프로필로 넘어가며 자신의 프로젝트 현황을 볼 수 있으며 로그아웃 기능이 있다.

 - #### 내 프로필 

<img width="728" alt="내 프로필" src="https://user-images.githubusercontent.com/91197026/143185896-8dbb35b5-18ad-4928-9f07-60928e50a7e4.png">

 - #### 내 프로젝트

<img width="712" alt="내 프로젝트" src="https://user-images.githubusercontent.com/91197026/143186171-77b4b627-2259-479c-9b22-fcb3043ad1cb.png">

네비게이션의 기능은 사용자가 만든 모든 프로젝트 리스트 또는 유저의 프로필 리스트를 볼 수 있다.

 - #### 프로젝트 리스트

<img width="728" alt="프로젝트 리스트" src="https://user-images.githubusercontent.com/91197026/143187331-967fde33-ccb5-4710-b9ca-cd7a64ab9e19.png">

이 페이지에선 프로젝트를 볼 수 도 있고 해당 프로젝트에 참여도 가능하며 새 프로젝트 버튼을 눌러 프로젝트를 만들 수도 있다.

 - #### 프로젝트 보기&참여

<img width="716" alt="프로젝트 뷰 참여" src="https://user-images.githubusercontent.com/91197026/143199072-e9351051-3519-443b-861d-349300ee9aee.png">
 
 - #### 새 프로젝트 만들기
<img width="403" alt="프로젝트 폼" src="https://user-images.githubusercontent.com/91197026/143188043-64378c36-2ff5-4c8b-a1f5-d0381df52464.png">

프로젝트의 제목과 내용,만료일,사용할 언어/스택을 입력한 뒤 생성하면 된다.

 - #### 프로필 리스트
 
<img width="727" alt="프로필 메인" src="https://user-images.githubusercontent.com/91197026/143199621-73b8b4cc-8da0-4197-ad3c-bd82aabca3bd.png">

유저들의 목록을 볼 수 있는 사이트이며 찾고자 하는 기술을 가진 유저을 검색하여 찾을 수 있다.

 ---

