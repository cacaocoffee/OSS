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

## 언어 유저 연결 테이블
table: languag_user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| userid                     | user테이블  id   | int unsigned |       AUTO_INCREMENT    | NOT NULL | PRIMARY KEY,FOREIGN KEY |
| language                     | 사용 언어      | int unsigned |          | NOT NULL |  PRIMARY KEY,FOREIGN KEY |

## 할일 테이블
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id               | todo 테이블  id   | int unsigned |   AUTO_INCREMENT    | NOT NULL | PRIMARY KEY |
| deadline         | 마감 기간      | date|          | NOT NULL | |
| todo              | todo 테이블  id   | text|    | NOT NULL |  |


## 프로젝트 테이블
table:  project
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| id                     | 프로젝트     식별아이디      | int unsigned |       -           | NOT NULL | PRIMARY KEY |
| name          | 프로젝트이름 |  tinytext(20)    |       -          | NOT NULL |  |
| description               | 프로젝트 설명 | text    |       -           |  NULL |                  |
|deadline| 프로젝트 종료기간 |  date| NOT NULL | |

## 프로젝트 명단 테이블
table:  project_user
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
|userid                     | 유저아이디      | int unsigned |       -           | NOT NULL | FOREIGN KEY |
| projectid          | 프로젝트아이디 |  int unsigned    |       -          | NOT NULL |  FOREIGN KEY|

##프로젝트 언어 테이블
table: language_project
| Column Name | Comment           | data type       | Default     | NULL        | Option            |
|-----------------:|:------------------|:---------------|:------------|:------------|:----------------|
| languageid          | 사용언어식별아이디      | int unsigned |       -           | NOT NULL | FOREIGN KEY language_list(id)|
| projectid        | 프로젝트식별아이디 |  int unsigned    |       -          | NOT NULL | FOREIGN KEY project(id) |
