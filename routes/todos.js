const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
    const todos = db
    .prepare(`
        SELECT * FROM todos
        WHERE userId = ?`)
    .all(req.session.userId);

    const formattedTodos = todos.map(todo => ({
        ...todo,
        isDone: Boolean(todo.isDone)
    }));

    return res.status(201).json({
        "data": formattedTodos
    });
});

router.get("/:id", auth, (req, res) => {
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
        AND userId = ?
    `);

    const todo = stmt.get(
        id,
        req.session.userId
    );

    if (!todo) {
        return res.status(404).json({
            "message": "Todo not found."
        });
    }
    
    todo.isDone = Boolean(todo.isDone);

    res.json(todo);
});

router.post("/", auth, (req, res) => {
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
        (message, isDone, userId)
        VALUES (?, ?, ?)
    `);

    stmt.run(
       req.body.message,
       0,
       req.session.userId
    );

    res.status(201).json({ 
        message: "Todo created successfully!"
    });
});

router.put("/:id", auth, (req, res) => {

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
        AND userId = ?
    `);

    const result = stmt.run(
        req.body.message,
        req.body.isDone ? 1 : 0,
        id,
        req.session.userId
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

router.delete("/:id", auth, (req, res) => {
  const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid ID."
        });
    }

    const stmt = db.prepare(`
        DELETE FROM todos 
        WHERE id = ?
        AND userId = ?
    `);

    const result = stmt.run(
        id,
        req.session.userId
    );

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

module.exports = router;