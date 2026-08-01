const express = require('express');
const db = require('../db');

const router = express.Router();

router.get("/login", (req, res) => {
    res.send("Route is working!");
});

module.exports = router;