CREATE TABLE moods
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    date       DATE    NOT NULL,
    value      INTEGER NOT NULL,
    created_at DATE    NOT NULL,
    updated_at DATE,
    deleted_at DATE,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);