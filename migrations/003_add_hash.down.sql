ALTER TABLE users DROP COLUMN salt;
ALTER TABLE patients DROP COLUMN salt;

UPDATE users
SET password = 'admin';

