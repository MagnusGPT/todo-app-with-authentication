const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.json());

const toDoList = {};
let toDoID = 0;


app.get('/todos', (req, res) => {

    if (!toDoList[id]) {
        return res.status(404).json({
            "message": "Todo not found."
        });
    }
    
    res.json(toDoList);
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

    toDoList[toDoID] = req.body;
    toDoList[toDoID].isDone = false;
    toDoID++;

    res.status(201).json({ 
        message: "Todo created successfully!", 
        data: toDoList 
    });
});

app.put('/todos/:id', (req, res) => {

    const allowedFields = ["message", "isDone"];

    const keys = Object.keys(req.body);

    // Check for unexpected fields
    const hasOnlyAllowedFields = keys.every(key => allowedFields.includes(key));

    if (!hasOnlyAllowedFields) {
        return res.status(400).json({
            message: "Request contains invalid fields."
        });
    }

    // Check required fields
    if (!("message" in req.body) || !("isDone" in req.body)) {
        return res.status(400).json({
            message: "message and isDone are required."
        });
    }

    // Check types
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

    toDoList[req.params.id].message = req.body.message;
    toDoList[req.params.id].isDone = req.body.isDone;
    
    res.status(201).json({ 
        message: "Todo updated successfully!", 
        data: toDoList 
    });
});

app.delete('/todos/:id', (req, res) => {
    delete toDoList[req.params.id];

    res.status(201).json({ 
        message: "Todo deleted successfully!", 
        data: toDoList 
    });
});



server.listen(3000, () => {
    console.log('App listening on http://localhost:3000');
});