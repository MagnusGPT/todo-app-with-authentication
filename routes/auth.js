const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { validateCredentials } = require("../utils/validation");


const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).get(username.toLowerCase());

    if(!user) {
        return res.status(401).json({
            message: "Invalid credentials."
        });
    }

    const passwordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordCorrect) {
        return res.status(401).json({
            message: "Invalid credentials."
        });
    }

    req.session.userId = user.id;

    res.json({
        message: "Logged in successfully."
    });
});

router.post("/register", async (req, res) => {

    if (!validateCredentials(req.body)) {
        return res.status(400).json({
            message: "Invalid credentials."
        });
    }

    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        db.prepare(`
            INSERT INTO users 
            (username, passwordHash) 
            VALUES 
            (?, ?)`)
        .run(
            username.toLowerCase(), 
            passwordHash
        );
        
        return res.status(201).json({ 
            message: "User created successfully." 
        });
    } 
    catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ 
                message: "This username already exists." 
            });
        }
        return res.status(500).json({ 
            message: "Internal server error."
        });
    }
});


router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                message: "Could not log out."
            });
        }

        res.json({
            message: "Logged out successfully."
        });

    });

});


module.exports = router;