const path = require('path');
const crypto = require('crypto');
const express = require("express");
//Express router
const router = express.Router();

router.use("/static", express.static("static"));

router.get("/", (req, res) => {
    res.render("index", {});
});

module.exports = router;