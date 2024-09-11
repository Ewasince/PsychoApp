CREATE TABLE user
(
    UserId    INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName  TEXT NOT NULL,
    UserEmail TEXT NOT NULL UNIQUE
);

CREATE TABLE patient
(
    PatientId    INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientName  TEXT    NOT NULL,
    PatientEmail TEXT    NOT NULL UNIQUE,
    UserId       INTEGER NOT NULL,
    FOREIGN KEY (UserId) REFERENCES user (UserId)
);

CREATE TABLE story
(
    StoryId        INTEGER PRIMARY KEY AUTOINCREMENT,
    StoryDate      DATE    NOT NULL,
    StorySituation TEXT    NOT NULL,
    StoryMind      TEXT    NOT NULL,
    StoryEmotion   TEXT    NOT NULL,
    StoryPower     INTEGER NOT NULL,
    PatientId      INTEGER NOT NULL,
    FOREIGN KEY (PatientId) REFERENCES patient (PatientId)
);