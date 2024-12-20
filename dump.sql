BEGIN TRANSACTION;
-- CREATE TABLE IF NOT EXISTS I schema_migrations (version bigint,dirty bool);
-- INSERT INTO schema_migrations VALUES(7,0);
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    username   TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    salt       TEXT
);
INSERT INTO users VALUES(39,'admin','admin@example.com','admin','$2a$10$x4ukaIiCuP9APhvBGmxBxOWr3yIdCENyH4/e3Ny0cuBR1X2/ID7x.','2024-09-24 00:15:27.2163472+03:00','2024-09-24 00:15:27.2163472+03:00',NULL,'Iv398Js9');
INSERT INTO users VALUES(40,'qwer','qwer@example.com','qwer','$2a$10$x4ukaIiCuP9APhvBGmxBxOWr3yIdCENyH4/e3Ny0cuBR1X2/ID7x.','2024-09-24 00:15:27.2163472+03:00','2024-09-24 00:15:27.2163472+03:00',NULL,'Iv398Js9');
INSERT INTO users VALUES(41,'qwe@qwe.qwe','qweasd','testqwer','$2a$10$kmZGLTEZxSIttv4USdqFQO./wID2jtAmR.zzQ3Y0bao81XWYm4h86','2024-10-06 13:29:15.1956795+03:00','2024-10-06 13:29:15.1956795+03:00',NULL,'AEgQVLrJ');
INSERT INTO users VALUES(42,'qwasde@qwe.qwe','qweasdsdf','testqwersdf','$2a$10$KczjsSBjQsrWS1eNLjvH5u8RUwkNG5ESKKiavb891347pCYFLKs9S','2024-10-06 13:29:59.3777695+03:00','2024-10-06 13:29:59.3777695+03:00',NULL,'HZRg7sHt');
INSERT INTO users VALUES(43,'qwasdeasd@qwe.qwe','sdfg','asdfsd','$2a$10$mi9tYSSCcN1hwDm2k5fAhejqI3P2DClzI8u6WGl/6I4lKOjatmjcm','2024-10-06 13:33:03.6748038+03:00','2024-10-06 13:33:03.6748038+03:00',NULL,'omr4cNV7');
INSERT INTO users VALUES(44,'Pidor Gnoiny','qqq1@qqq.qqq','qqq','$2a$10$HMeg3Zdisf/zlPesp2/wk.FHPuHGtlyBsxkKnA/Cwvl2hNfl35ki.','2024-10-06 13:39:28.4817951+03:00','2024-10-06 13:39:28.4817951+03:00',NULL,'oRqajWXe');
INSERT INTO users VALUES(45,'Pidor Gnoiny','qqq2@qqq.qqq','qqq2@qqq.qqq','$2a$10$Q0mdM0sqbSVcjk/d8m0JQOrU9hnMrbGkWcmT.lvcJOKrGissAYbDm','2024-10-06 13:43:14.7912708+03:00','2024-10-06 13:43:14.7912708+03:00',NULL,'E3clCl3R');
CREATE TABLE IF NOT EXISTS stories
(
    id         SERIAL PRIMARY KEY,
    date       DATE    NOT NULL,
    situation  TEXT    NOT NULL,
    mind       TEXT    NOT NULL,
    emotion    TEXT    NOT NULL,
    power      INTEGER NOT NULL,
    patient_id INTEGER NOT NULL REFERENCES patients (id),
    created_at DATE    NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    attention  INTEGER,
    mark       INTEGER
);
INSERT INTO stories VALUES(343,'2024-09-24 00:00:00+03:00','Уронил мороженое','Вот дурак','Грусть',7,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(344,'2024-09-23 00:00:00+03:00','Сказали что скуф','Где альтушка?','Печаль',8,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(345,'2024-09-22 00:00:00+03:00','Колени хрустят, кружится спина','Таблеток бы...','Задумчивость',4,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(346,'2024-09-21 00:00:00+03:00','Колени хрустят, кружится спина','Таблеток бы...','Задумчивость',4,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(347,'2024-09-20 00:00:00+03:00','Болит голова, глаза режет','Может прилечь на часок','Раздражение',3,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(348,'2024-09-19 00:00:00+03:00','Тянет шею, сложно двигаться','Надо бы массаж сделать','Усталость',2,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(349,'2024-09-18 00:00:00+03:00','Затекла рука, не чувствую пальцы','Где мой крем?','Тревога',3,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(350,'2024-09-17 00:00:00+03:00','Ноги как ватные, шатаюсь','Дойти бы до дома...','Беспокойство',2,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(351,'2024-09-16 00:00:00+03:00','Спина болит при движении','Нужно больше растягиваться','Недовольство',3,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(352,'2024-09-15 00:00:00+03:00','Ломота в суставах','Завтра к врачу','Неуверенность',1,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(353,'2024-09-14 00:00:00+03:00','Головокружение, всё плывет','Нужно больше пить воды','Замешательство',3,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(354,'2024-09-13 00:00:00+03:00','Ощущение тяжести в ногах','Пора бы размяться','Фрустрация',4,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(355,'2024-09-12 00:00:00+03:00','Немеют пальцы, сложно двигать','Опять руки...','Огорчение',2,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(356,'2024-09-11 00:00:00+03:00','Слабость в руках, тяжело поднимать','Где мои силы?','Печаль',1,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(357,'2024-09-10 00:00:00+03:00','Шея затекла, тяжело двигать','Надо больше разминаться','Неприятие',3,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(358,'2024-09-09 00:00:00+03:00','Хруст в коленях при движении','Пора на обследование','Задумчивость',4,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(359,'2024-09-08 00:00:00+03:00','Слабость в ногах, тяжело ходить','Нужно больше двигаться','Разочарование',2,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(360,'2024-09-07 00:00:00+03:00','Чувство усталости, трудно сосредоточиться','Нужен отдых','Невыразительность',1,41,'2024-09-24 00:15:27.2178475+03:00','2024-09-24 00:15:27.2178475+03:00',NULL,NULL,NULL);
INSERT INTO stories VALUES(404,'2024-10-09 21:31:24.6060667+03:00','4','4','Интерес',4,47,'2024-10-09 21:31:24.6060667+03:00','2024-10-09 21:35:01.8470419+03:00',NULL,NULL,1);
INSERT INTO stories VALUES(405,'2024-10-09 21:39:41.1266816+03:00','4','4','Интерес',4,47,'2024-10-09 21:39:41.1272132+03:00','2024-10-09 21:40:29.7791873+03:00',NULL,NULL,1);
INSERT INTO stories VALUES(409,'2024-10-09 22:03:55.9935177+03:00','5','5','Интерес',5,47,'2024-10-09 22:03:55.9935177+03:00','2024-10-09 22:06:18.3767441+03:00',NULL,NULL,2);
INSERT INTO stories VALUES(410,'2024-10-09 22:06:47.8830323+03:00','5','5','Интерес',5,47,'2024-10-09 22:06:47.8830323+03:00','2024-10-09 22:07:58.79989+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(412,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(413,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(414,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(415,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(416,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(417,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(418,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(419,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(420,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(421,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(422,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(423,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(424,'2024-10-09 22:09:03.2349593+03:00','4','4','Интерес',4,47,'2024-10-09 22:09:03.2349593+03:00','2024-10-09 22:09:06.1836111+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(425,'2024-10-22 21:39:45.2705505+03:00','выа','й','Обида',8,49,'2024-10-22 21:39:45.2705505+03:00','2024-10-22 21:39:45.2721368+03:00',NULL,NULL,3);
INSERT INTO stories VALUES(426,'2024-11-03 13:31:09.8281814+03:00','йцу','йцук','Интерес',4,49,'2024-11-03 13:31:09.8281814+03:00','2024-11-03 13:31:09.8308141+03:00',NULL,NULL,1);
CREATE TABLE IF NOT EXISTS moods
(
    id         SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients (id),
    date       DATE    NOT NULL,
    value      INTEGER NOT NULL,
    created_at DATE    NOT NULL,
    updated_at DATE,
    deleted_at DATE
);
INSERT INTO moods VALUES(8,47,'2024-10-05 00:00:00+03:00',5,'2024-10-05 06:00:00+03:00','2024-10-05 06:00:00+03:00',NULL);
INSERT INTO moods VALUES(9,47,'2024-10-07 00:00:00+03:00',-3,'2024-10-07 07:00:00+03:00','2024-10-07 07:00:00+03:00',NULL);
INSERT INTO moods VALUES(10,47,'2024-10-09 00:00:00+03:00',4,'2024-10-09 05:00:00+03:00','2024-10-09 05:00:00+03:00',NULL);
INSERT INTO moods VALUES(11,49,'2024-11-03 00:00:00+03:00',3,'2024-11-03 13:31:13.2560772+03:00','2024-11-03 13:31:13.2560772+03:00',NULL);
CREATE TABLE IF NOT EXISTS invites
(
    id         SERIAL PRIMARY KEY,
    email      TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE
);
INSERT INTO invites VALUES(4,'qqq1@qqq.qqq','2024-10-06 13:38:43.536292+03:00','2024-10-06 13:38:43.536292+03:00','2024-10-06 13:39:28.4849592+03:00');
INSERT INTO invites VALUES(5,'qqq2@qqq.qqq','2024-10-06 13:42:56.2023884+03:00','2024-10-06 13:42:56.2023884+03:00','2024-10-06 13:43:14.793394+03:00');
CREATE TABLE IF NOT EXISTS patients
(
    id            SERIAL PRIMARY KEY,
    name          TEXT    NOT NULL,
    last_name     TEXT,
    email         TEXT,
    username      TEXT    NOT NULL,
    password      TEXT    NOT NULL,
    user_id       INTEGER NOT NULL REFERENCES users (id),
    tg_id         INTEGER,
    created_at    DATE    NOT NULL,
    updated_at    DATE,
    deleted_at    DATE,
    next_schedule DATE,
    tg_chat_id    INTEGER,
    salt          TEXT
);
INSERT INTO patients VALUES(40,'patient','','admin@example.com','patient','patient',39,0,'2024-09-24 00:15:27.2168478+03:00','2024-09-24 00:15:27.2168478+03:00',NULL,NULL,NULL,NULL);
INSERT INTO patients VALUES(41,'patient_qwer','','qwer@example.com','patient_qwer','patient_qwer',39,0,'2024-09-24 00:15:27.2168478+03:00','2024-09-24 00:15:27.2168478+03:00',NULL,NULL,NULL,NULL);
INSERT INTO patients VALUES(47,'Владислав','','','ewasince','',39,493410224,'2024-09-28 15:47:52.1642031+03:00','2024-10-05 16:17:30.2022867+03:00','2024-10-05 16:17:30.2022867+03:00',NULL,493410224,NULL);
INSERT INTO patients VALUES(48,'Ginger','Ranger','','whatisbipki','',39,1874573982,'2024-10-06 10:18:32.0191696+03:00','2024-10-06 10:18:32.0191696+03:00',NULL,NULL,1874573982,NULL);
INSERT INTO patients VALUES(49,'Владислав','','','ewasince','',39,493410224,'2024-10-22 20:14:12.3091637+03:00','2024-11-03 13:51:25.9896087+03:00','2024-11-03 13:51:25.9896087+03:00','2024-11-04 02:00:00+03:00',493410224,NULL);
INSERT INTO patients VALUES(50,'Владислав','','','ewasince','',39,493410224,'2024-11-03 14:03:50.0786932+03:00','2024-11-03 14:03:50.0786932+03:00',NULL,NULL,493410224,NULL);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',45);
INSERT INTO sqlite_sequence VALUES('stories',426);
INSERT INTO sqlite_sequence VALUES('moods',11);
INSERT INTO sqlite_sequence VALUES('invites',5);
INSERT INTO sqlite_sequence VALUES('patients',50);
CREATE UNIQUE INDEX version_unique ON schema_migrations (version);
COMMIT;
