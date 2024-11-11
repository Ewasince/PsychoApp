CREATE TABLE users
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

CREATE TABLE patients
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

CREATE TABLE stories
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

CREATE TABLE moods
(
    id         SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients (id),
    date       DATE    NOT NULL,
    value      INTEGER NOT NULL,
    created_at DATE    NOT NULL,
    updated_at DATE,
    deleted_at DATE
);

CREATE TABLE invites
(
    id         SERIAL PRIMARY KEY,
    email      TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE
);
