ALTER TABLE users ADD COLUMN salt TEXT;
ALTER TABLE patients ADD COLUMN salt TEXT;

UPDATE users
SET password = '$2a$10$x4ukaIiCuP9APhvBGmxBxOWr3yIdCENyH4/e3Ny0cuBR1X2/ID7x.',
    salt = 'Iv398Js9';
