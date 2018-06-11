const fs = require("fs");
const express = require("express");
const shortid = require("shortid");
const multer = require("multer");
//Check folder
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
//Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate());
    }
});
var upload = multer({
    storage: storage
}).single("file");
//Express router
const router = express.Router();

router.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).send(JSON.stringify({
                status: "error",
                msg: "Invalid request"
            }));
        }
        res.send(JSON.stringify({
            status: "ok",
            link: process.env.REDIRECT_PATH + req.file.filename,
        }));
    });
});

module.exports = router;