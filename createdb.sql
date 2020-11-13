CREATE TABLE users (
       username TEXT NOT NULL UNIQUE,
       passwordHash TEXT NOT NULL
);

CREATE TABLE todos (
       username TEXT,
       content TEXT NOT NULL,
       done BOOLEAN NOT NULL,
       id INTEGER PRIMARY KEY,
       FOREIGN KEY (username) REFERENCES users (username)
);
