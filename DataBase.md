## 테이블 목록
1. [유저](#유저-테이블)
2. [언어 리스트](#언어-리스트-테이블)
3. [사용자 언어 리스트](#사용자-언어-리스트)
4. [할일 데이터](#할일-테이블)
5. [사용자 할일 연결](#할일-유저연결-테이블)
6. [프로젝트 데이터](#프로젝트-테이블)
7. [프로젝트 명단](#프로젝트-명단-테이블)
8. [프로젝트 사용 언어](#프로젝트-언어-테이블)


## 유저 테이블
table: user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id                     | 유저식별아이디      | int unsigned |       AUTO_INCREMENT    | NOT NULL | PRIMARY KEY |
| userid          | 로그인 id |  varchar(16)    |       -          | NOT NULL |PRIMARY KEY  |
| pw               | 로그인 패스워드| char(64)    |       -           | NOT NULL |                  |
| name                  | 사용자 이름      | int unsigned |       -           | NOT NULL |  |
|description| 유저소개글 |  tinytext| unknown |  | |
|authorize| 페이지 이용 승인 여부 |  tinyint(1)| 0 |NOT NULL | |

## 언어 리스트 테이블
table: languag_list
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id                     | 언어 id      | int unsigned |       AUTO_INCREMENT    | NOT NULL | PRIMARY KEY |
| language                     | 언어 이름      | varchar(16) |          |  |  |

## 사용자 언어 리스트
table: languag_user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| userid                     | user테이블  id   | int unsigned |       AUTO_INCREMENT    | NOT NULL | PRIMARY KEY,FOREIGN KEY |
| language                     | 사용 언어      | int unsigned |          | NOT NULL |  PRIMARY KEY,FOREIGN KEY |

## 할일 테이블
table: todo
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id               | todo 테이블  id   | int unsigned |   AUTO_INCREMENT    | NOT NULL | PRIMARY KEY |
| deadline         | 마감 기간      | date|          | NOT NULL | |
| todo              | todo 테이블  id   | text|    | NOT NULL |  |

## 할일 유저연결 테이블
table: todo_user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| userid           | 연결된 사용자 식별 id   | int unsigned |       | NOT NULL | PRIMARY KEY, FOREIGN KEY |
| todoid           | 연결된 todo 정보 id    | int unsigned |          | NOT NULL | PRIMARY KEY, FOREIGN KEY |
| projectid        | 연결된 프로젝트  id   | int unsigned |    | NULL |  |
| overwrite        | 연결된 프로젝트 구성원의 상태 변경 가능 여부   | tinyint(1) |  0  | NOT NULL |  |
| done        | 할일 수행 여부  | tinyint(1) |   0 | NOT NULL |  |
| cleardate |실행 완료 시간 |date||||

## 프로젝트 테이블
table:  project
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id                     | 프로젝트     식별아이디      | int unsigned |       -           | NOT NULL | PRIMARY KEY |
| leaderid| 프로젝트 팀장 아이디|int unsigned||NOT NULL|FOREIGN KEY|
| name          | 프로젝트이름 |  tinytext(20)    |       -          | NOT NULL |  |
| description               | 프로젝트 설명 | text    |       -           |  NULL |                  |
| deadline| 프로젝트 종료기간 |  date| NOT NULL | |
|createtime| 프로젝트 생성 기간|datetime||NOT NULL||

## 프로젝트 명단 테이블
table:  project_user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
|userid                     | 유저아이디      | int unsigned |       -           | NOT NULL | PRIMARY KEY,FOREIGN KEY |
| projectid          | 프로젝트아이디 |  int unsigned    |       -          | NOT NULL | PRIMARY KEY,FOREIGN KEY|

## 프로젝트 언어 테이블
table: language_project
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| languageid          | 사용언어식별아이디      | int unsigned |       -           | NOT NULL |PRIMARY KEY, FOREIGN KEY language_list(id)|
| projectid        | 프로젝트식별아이디 |  int unsigned    |       -          | NOT NULL | PRIMARY KEY, FOREIGN KEY project(id) |
