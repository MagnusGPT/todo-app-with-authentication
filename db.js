const Database = require('better-sqlite3');

const db = new Database("todos.db");

// Enable foreign key support
db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        isDone INTEGER NOT NULL DEFAULT 0,

        userId INTEGER NOT NULL,

        FOREIGN KEY (userId)
            REFERENCES users(id)
            ON DELETE CASCADE
    );
`);

module.exports = db;