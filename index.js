const express = require('express');
const db = require('./db');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.json());

const toDoList = {};
let toDoID = 0;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/todos', (req, res) => {
    const todos = db
    .prepare('SELECT * FROM todos;')
    .all();

    const formattedTodos = todos.map(todo => ({
        ...todo,
        isDone: Boolean(todo.isDone)
    }));

    return res.status(201).json({
        "data": formattedTodos
    });
});

app.get('/todos/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid ID."
        });
    }
    
    const stmt = db
    .prepare(`
        SELECT * FROM todos
        WHERE id = ?
    `);

    const todo = stmt.get(id);

    if (!todo) {
        return res.status(404).json({
            "message": "Todo not found."
        });
    }
    
    todo.isDone = Boolean(todo.isDone);

    res.json(todo);
});

app.post('/todos', (req, res) => {
    const allowedFields = ["message"];

    const keys = Object.keys(req.body);

    const hasOnlyAllowedFields = keys.every(key => allowedFields.includes(key));

    if (!hasOnlyAllowedFields) {
        return res.status(400).json({
            message: "Request contains invalid fields."
        });
    }

    if (!("message" in req.body)) {
        return res.status(400).json({
            message: "message is required."
        });
    }

    if (typeof req.body.message !== "string") {
        return res.status(400).json({
            message: "message must be a string."
        });
    }

    const stmt = db.prepare(`
        INSERT INTO todos
        (message, isDone)
        VALUES (?, ?)
    `);

    stmt.run(
       req.body.message,
       0
    );

    res.status(201).json({ 
        message: "Todo created successfully!"
    });
});

app.put('/todos/:id', (req, res) => {

    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid ID."
        });
    }

    const allowedFields = ["message", "isDone"];

    const keys = Object.keys(req.body);

    const hasOnlyAllowedFields = keys.every(key =>
        allowedFields.includes(key)
    );

    if (!hasOnlyAllowedFields) {
        return res.status(400).json({
            message: "Request contains invalid fields."
        });
    }

    if (!("message" in req.body) || !("isDone" in req.body)) {
        return res.status(400).json({
            message: "message and isDone are required."
        });
    }

    if (typeof req.body.message !== "string") {
        return res.status(400).json({
            message: "message must be a string."
        });
    }

    if (typeof req.body.isDone !== "boolean") {
        return res.status(400).json({
            message: "isDone must be a boolean."
        });
    }

    const stmt = db.prepare(`
        UPDATE todos
        SET
            message = ?,
            isDone = ?
        WHERE id = ?
    `);

    const result = stmt.run(
        req.body.message,
        req.body.isDone ? 1 : 0,
        id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Todo not found."
        });
    }

    res.json({
        message: "Todo updated successfully."
    });

});

app.delete('/todos/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid ID."
        });
    }

    const stmt = db.prepare(`
        DELETE FROM todos 
        WHERE id = ?
    `);

    const result = stmt.run(id);

    //Did a row actually get deleted?
    if (result.changes === 0) {
        return res.status(404).json({
            message: "Todo not found."
        });
    }

    res.status(200).json({ 
        message: "Todo deleted successfully!"
    });
});



server.listen(3000, () => {
    console.log('App listening on http://localhost:3000');
});