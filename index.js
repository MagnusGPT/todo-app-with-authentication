const express = require("express");
const db = require("./db");
const session = require("express-session");

const todoRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");

const app = express();
const appPort = 3000;

app.use(express.json());

app.use(session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false
}));

app.use("/todos", todoRoutes);
app.use("/", authRoutes);

app.listen(appPort, () => {
    console.log("Server is running on port 3000.");
    console.log("Server: http://localhost:" + appPort);
});