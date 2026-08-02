const express = require('express');
const db = require('../db');
const { validateCredentials } = require("../utils/validation");


const router = express.Router();

router.post("/login", (req, res) => {
    
});

router.post("/register", (req, res) => {

    if (!validateCredentials(req.body)) {
        return res.status(400).json({
            message: "Invalid credentials."
        });
    }

    return res.status(200).json({
        message: "Didn't do shit but congratz."
    })
});

router.post("/logout", (req, res) => {

});


module.exports = router;