CREATE TABLE users
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE
);

CREATE TABLE patients
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    user_id    INTEGER NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE stories
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       DATE    NOT NULL,
    situation  TEXT    NOT NULL,
    mind       TEXT    NOT NULL,
    emotion    TEXT    NOT NULL,
    power      INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);