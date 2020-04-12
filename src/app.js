const debug = require("debug");
const express = require("express");
const morgan = require("morgan");

const logger = debug("hercules-base");
const db = require("./db.js");

const app = express();
// combined + response time
app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms`));

// Parse either query string or User-Agent for baseline version
app.get("/", (req, res, next) => {
    const versionString = req.query.version || req.headers["user-agent"];
    const userAgent = versionString.match(/EDOPRO-(WINDOWS|MAC|LINUX)-(\d+)\.(\d+)\.(\d+)/i);
    if (userAgent) {
        logger(`Detected user agent ${userAgent[0]} from %s`, req.query.version ? "query string" : "header");
        req.params.platform = userAgent[1].toUpperCase();
        req.params.major = parseInt(userAgent[2]);
        req.params.minor = parseInt(userAgent[3]);
        req.params.patch = parseInt(userAgent[4]);
        next();
    } else {
        res.status(400).send("Missing version parameter");
    }
});

// GET a JSON of needed patch downloads
app.get("/", (req, res) => {

});

// POST metadata for a new patch
app.post("/version", express.json(), (req, res) => {
    try {
        const {
            authToken,
            url,
            os,
            major,
            minor,
            patch,
            hash
        } = req.body;
        if (authToken !== process.env.HERCULES_BASE_SECRET) {
            res.sendStatus(401);
        }
        const statement = db.prepare(`INSERT INTO urls (url, os, major, minor, patch, hash, date)
            VALUES (@url, @os, @major, @minor, @patch, @hash, @date)`);
        const result = db.transaction(() => statement.run({ url, os, major, minor, patch, hash, date: Date.now() }))();
        logger("Added new entry %o", result);
        res.sendStatus(201);
    } catch(e) {
        logger("Failed to add entry %o", e);
        res.sendStatus(400);
    }
});

module.exports = app;
