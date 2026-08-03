const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { validateCredentials } = require("../utils/validation");


const router = express.Router();

router.post("/login", (req, res) => {
    
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
            (username, password) 
            VALUES 
            (?, ?)`)
        .run(
            username, 
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

});


module.exports = router;