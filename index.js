const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.json());

const toDoList = {};
let toDoID = 0;


app.get('/todos', (req, res) => {
    res.json(toDoList);
});

app.post('/todos', (req, res) => {
    toDoList[toDoID] = req.body;
    toDoList[toDoID].isDone = false;
    toDoID++;

    res.status(201).json({ 
        message: "Todo created successfully!", 
        data: toDoList 
    });
});

app.put('/todos', (req, res) => {
    toDoList[req.query.id].message = req.body.message;
    toDoList[req.query.id].isDone = req.body.isDone;

    res.status(201).json({ 
        message: "Todo updated successfully!", 
        data: toDoList 
    });
});

app.delete('/todos', (req, res) => {
    delete toDoList[req.query.id];

    res.status(201).json({ 
        message: "Todo deleted successfully!", 
        data: toDoList 
    });
});



server.listen(3000, () => {
    console.log('App listening on http://localhost:3000');
});