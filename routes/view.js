const path = require('path');
const URL = require('url').URL;
const appDir = path.dirname(require.main.filename);
const fs = require("fs");
const mmm = new require('mmmagic');
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const express = require("express");
//Express router
const router = express.Router();


router.get("/*", (req, res) => {
    let tar = path.normalize(decodeURIComponent(req.path));
    if (req.headers.referer) {
        let root = path.normalize(new URL(req.headers.referer).pathname);
        tar = path.normalize(path.join(root, tar));
    }
    if (tar.endsWith("/")) tar = tar.slice(0, -1);
    let fullTar = `./uploads${tar}`;
    if (!fs.existsSync(fullTar)) return send404(res);
    fs.stat(fullTar, (err, stats) => {
        if (err) {
            return send500(res, err);
        }
        if (stats.isDirectory()) return handleDirectory(fullTar, req, res);
        else if (stats.isFile()) {
            handleFile(fullTar, req, res);
        } else {
            return send404(res);
        }
    });
});

function handleFile(file, req, res) {
    fs.readFile(file, (err, data) => {
        if (err || !data) {
            return send500(res, err);
        }
        magic.detect(data, (err, mime) => {
            if (err || !mime) return send500(res, "Invalid file type! - " + "xd");
            res.type(mime).send(data);
        });
    });
}

function handleDirectory(dir, req, res) {
    let index = `${dir}/index.html`;
    if (fs.existsSync(index)) {
        return handleFile(index, req, res);
    }
    res.status(302).send("Folder exists. 'index.html' not found");
}

function send500(res, err) {
    console.error(err);
    return res.status(500).send("500 Internal server error");
}

function send404(res) {
    if (fs.existsSync("./404.png")) {
        return res.status(404).sendFile('./404.png', {
            root: appDir
        });
    } else return res.status(404).send("404 File not found");
}


module.exports = router;