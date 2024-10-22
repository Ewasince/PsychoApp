CREATE TABLE patients_new
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    last_name     TEXT,
    email         TEXT,
    username      TEXT    NOT NULL UNIQUE,
    password      TEXT    NOT NULL,
    user_id       INTEGER NOT NULL REFERENCES users,
    tg_id         INTEGER,
    created_at    DATE    NOT NULL,
    updated_at    DATE,
    deleted_at    DATE,
    next_schedule DATE,
    tg_chat_id    INTEGER,
    salt          TEXT
);

INSERT INTO patients_new(id, name, last_name, email, username, password, user_id, tg_id, created_at, updated_at,
                         deleted_at, next_schedule, tg_chat_id, salt)
SELECT id,
       name,
       last_name,
       email,
       username,
       password,
       user_id,
       tg_id,
       created_at,
       updated_at,
       deleted_at,
       next_schedule,
       tg_chat_id,
       salt
FROM patients;

-- 3. Удалить старую таблицу
DROP TABLE patients;

-- 4. Переименовать новую таблицу в старую
ALTER TABLE patients_new
    RENAME TO patients;
