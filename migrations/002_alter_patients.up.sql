-- 1. Создать новую таблицу с изменённым типом
CREATE TABLE patients_new
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    last_name  TEXT,
    email      TEXT,
    username   TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    user_id    INTEGER NOT NULL,
    tg_id      INTEGER,
    created_at DATE    NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 2. Перенести данные из старой таблицы в новую
INSERT INTO patients_new SELECT * FROM patients;

-- 3. Удалить старую таблицу
DROP TABLE patients;

-- 4. Переименовать новую таблицу в старую
ALTER TABLE patients_new RENAME TO patients;

ALTER TABLE patients ADD COLUMN next_schedule DATE;
ALTER TABLE patients ADD COLUMN tg_chat_id INTEGER;
