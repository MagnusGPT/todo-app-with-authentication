const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
    console.log('Someone entered! Yippieeee!');
});



server.listen(3000, () => {
    console.log('App listening on http://localhost:3000');
});