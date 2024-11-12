CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    username   TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
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
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP,
    deleted_at    TIMESTAMP,
    next_schedule TIMESTAMP,
    tg_chat_id    INTEGER,
    salt          TEXT
);

CREATE TABLE stories
(
    id         SERIAL PRIMARY KEY,
    date       TIMESTAMP    NOT NULL,
    situation  TEXT    NOT NULL,
    mind       TEXT    NOT NULL,
    emotion    TEXT    NOT NULL,
    power      INTEGER NOT NULL,
    patient_id INTEGER NOT NULL REFERENCES patients (id),
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    attention  INTEGER,
    mark       INTEGER
);

CREATE TABLE moods
(
    id         SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients (id),
    date       TIMESTAMP    NOT NULL,
    value      INTEGER NOT NULL,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE invites
(
    id         SERIAL PRIMARY KEY,
    email      TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
