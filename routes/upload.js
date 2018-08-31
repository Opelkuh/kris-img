const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const shortid = require("shortid");
const multer = require("multer");
const mongojs = require("mongojs");
//Connect to DB
const db = mongojs("kris-img", ["ids"]);
//Check folders
checkFolder("./temp");
checkFolder("./uploads");
//Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        checkFolder("./temp");
        if (!req.folderId || !req.fileInfo) {
            req.folderId = shortid.generate();
            req.fileInfo = [];
            fs.mkdirSync(`./temp/${req.folderId}`);
        };
        req.fileInfo.push(file);
        let tar = `./temp/${req.folderId}`;
        cb(null, tar);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).array("files");
//Express router
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}));

router.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err || !req.files) {
            console.error(err);
            return res.status(400).send(JSON.stringify({
                status: "error",
                msg: "Invalid request"
            }));
        }
        //Multiple files
        if (req.files.length > 1) {
            fs.mkdirSync(`./uploads/${req.folderId}`);
            for (let i in req.fileInfo) {
                let name = req.fileInfo[i].originalname;
                fs.renameSync(getTempFile(req, i), `./uploads/${req.folderId}/${name}`);
            }
            //Single file
        } else {
            fs.renameSync(getTempFile(req, 0), `./uploads/${req.folderId}`);
        }
        res.send(JSON.stringify({
            status: "ok",
            link: `${process.env.REDIRECT_PATH}${req.folderId}`,
        }));
        //Delete temp dir
        fs.rmdir(`./temp/${req.folderId}`, (err) => {
            if (err) console.log(err);
        });
    });
});

function getTempFile(req, index) {
    return `./temp/${req.folderId}/${req.fileInfo[index].originalname}`;
}

function checkFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

module.exports = router;