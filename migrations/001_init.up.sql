CREATE TABLE user
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE patient
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT NOT NULL,
    email   TEXT NOT NULL UNIQUE,
    user_id INTEGER  NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE story
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       DATE NOT NULL,
    situation  TEXT NOT NULL,
    mind       TEXT NOT NULL,
    emotion    TEXT NOT NULL,
    power      INTEGER  NOT NULL,
    patient_id INTEGER  NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient (id)
);