CREATE TABLE users
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE patients
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT NOT NULL,
    email   TEXT NOT NULL UNIQUE,
    user_id INTEGER  NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE stories
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       DATE NOT NULL,
    situation  TEXT NOT NULL,
    mind       TEXT NOT NULL,
    emotion    TEXT NOT NULL,
    power      INTEGER  NOT NULL,
    patient_id INTEGER  NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);