require("dotenv").config();

const debug = require("debug");
const express = require("express");
const morgan = require("morgan");

const logger = debug("hercules-base");
const db = require("./db.js");

function flushResponseCache() {
    const statementDelete = db.prepare("DELETE FROM responses");
    const deleted = statementDelete.run();
    logger("Flushed cache database, deleting %o", deleted.changes);
}

const app = express();
// combined + response time
app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms`));

// Parse either query string or User-Agent for baseline version
app.get("/", (req, res, next) => {
    const versionString = req.query.version || req.headers["user-agent"];
    const userAgent = versionString.match(/^EDOPRO-(WINDOWS|MAC|LINUX|ANDROID)-(\d+)\.(\d+)\.(\d+)(.*)$/i);
    if (userAgent) {
        logger(`Detected user agent ${userAgent[0]} from %s`, req.query.version ? "query string" : "header");
        req.userAgent = {
            os: userAgent[1].toUpperCase(),
            major: parseInt(userAgent[2]),
            minor: parseInt(userAgent[3]),
            patch: parseInt(userAgent[4]),
	    other: userAgent[5]
        };
        next();
    } else {
        res.status(400).send("Missing version parameter");
    }
});

// GET a JSON of needed patch downloads
app.get("/", (req, res) => {
    const { os, major, minor, patch, other } = req.userAgent;
    const queryCache = db.prepare("SELECT json FROM responses WHERE os = ? AND major = ? AND minor = ? AND patch = ?");
    const cache = queryCache.all([ os, major, minor, patch ]);
    if (cache.length) {
        logger(`Cache hit for ${os}/${major}.${minor}.${patch}`);
        res.set("Content-Type", "application/json");
        res.send(cache[0].json);
    } else {
        logger(`Cache miss for ${os}/${major}.${minor}.${patch}`);
        const queryPatches = db.prepare("SELECT (major || '.' || minor || '.' || patch) as name, hash as md5, url FROM urls WHERE name > ? AND os = ? ORDER BY name ASC");
        const result = queryPatches.all(`${major}.${minor}.${patch}`, os);
        res.json(result);
        const cacheInsert = db.prepare("INSERT INTO responses (os, major, minor, patch, json) VALUES (@os, @major, @minor, @patch, @json)");
        try {
            cacheInsert.run({ os, major, minor, patch, json: JSON.stringify(result) });
        } catch(err) {
            logger("Failed to cache result %o", err);
        }
    }
});

// POST metadata for a new patch
app.post("/version", express.json(), (req, res) => {
    try {
        const {
            authToken,
            url,
            os,
            major = parseInt(major),
            minor = parseInt(minor),
            patch = parseInt(patch),
            hash
        } = req.body;
        if (authToken !== process.env.HERCULES_BASE_SECRET) {
            return res.sendStatus(401);
        }
        if (!url || !os || !hash || isNaN(major) || isNaN(minor) || isNaN(patch)) {
            return res.sendStatus(400);
        }
        const statementInsert = db.prepare(`INSERT INTO urls (url, os, major, minor, patch, hash, date)
            VALUES (@url, @os, @major, @minor, @patch, @hash, @date)`);
        const result = statementInsert.run({ url, os, major, minor, patch, hash, date: Date.now() });
        logger("Added new entry %o", result);
        flushResponseCache();
        res.sendStatus(201);
    } catch(e) {
        logger("Failed to add entry %o", e);
        res.sendStatus(400);
    }
});

// DELETE version entry by OS and version, optionally verifying hash first
app.delete("/version", express.json(), (req, res) => {
    if (req.body.authToken !== process.env.HERCULES_BASE_SECRET) {
        return res.sendStatus(401);
    }
    try {
        const {
            os,
            major = parseInt(major),
            minor = parseInt(minor),
            patch = parseInt(patch)
        } = req.body;
        if (!os || isNaN(major) || isNaN(minor) || isNaN(patch)) {
            return res.sendStatus(400);
        }
        let sql = "DELETE FROM urls WHERE os = ? AND major = ? AND minor = ? AND patch = ?";
        let result;
        if (req.body.hash) {
            sql += " AND hash = ?";
            result = db.prepare(sql).run(os, major, minor, patch, hash);
        } else {
            result = db.prepare(sql).run(os, major, minor, patch);
        }
        logger("Deleted entry %o", result);
        if (result.changes) {
            flushResponseCache();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(400);
    }
});

const server = app.listen(process.env.HERCULES_BASE_PORT || 3000, () => {
    logger(`Listening on ${process.env.HERCULES_BASE_PORT}.`);
});

server.on("close", () => {
    logger("Closing database connection.");
    db.close();
});

module.exports = server;
