const Database = require('better-sqlite3');

const db = new Database("todos.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        isDone BOOLEAN NOT NULL
    );
`);

module.exports = db;