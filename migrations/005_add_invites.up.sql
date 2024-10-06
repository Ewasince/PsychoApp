CREATE TABLE invites
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    deleted_at DATE
);