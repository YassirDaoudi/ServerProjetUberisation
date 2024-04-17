\c db;
CREATE TABLE users(
    id serial PRIMARY KEY NOT NULL,
    fullname VARCHAR(20),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    usertype VARCHAR(20)
);

