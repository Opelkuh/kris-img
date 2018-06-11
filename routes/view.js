const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require("fs");
const fileType = require("file-type");
const express = require("express");
//Express router
const router = express.Router();


router.get("/:imageId", (req, res) => {
    if (!req.params || !req.params.imageId) return send404(res);
    let imageId = path.basename(req.params.imageId);
    if (imageId != req.params.imageId) {
        return res.send("Nice try");
    }
    let target = "./uploads/" + imageId;
    if (!fs.existsSync(target)) return send404(res);
    fs.readFile(target, (err, data) => {
        if (err) {
            return send500(res, err);
        }
        let type = fileType(data);
        if (!type.mime) {
            return send500(res, "Invalid file type! - " + type);
        }
        res.type(type.mime).send(data);
    });
});

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