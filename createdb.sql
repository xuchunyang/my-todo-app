CREATE TABLE users (
       username TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
);

CREATE TABLE todos (
       username TEXT,
       content TEXT NOT NULL,
       done BOOLEAN NOT NULL,
       id INTEGER PRIMARY KEY,
       FOREIGN KEY (username) REFERENCES users (username)
);

PRAGMA foreign_keys = ON;
INSERT INTO users VALUES ("user", "pass");
INSERT INTO todos VALUES ("user", "cut hair", false, NULL);
INSERT INTO todos VALUES ("user", "take a bath", false, NULL);
INSERT INTO todos VALUES ("user", "eat orange", false, NULL);
