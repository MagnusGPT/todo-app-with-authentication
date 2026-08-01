const express = require("express");
const db = require("./db");

const todoRoutes = require("./routes/todos");

const app = express();
const appPort = 3000;

app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(appPort, () => {
    console.log("Server is running on port 3000.");
    console.log("Server: http://localhost:" + appPort);
});