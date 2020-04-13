const fs = require("fs");
const path = require('path');

const debug = require("debug");
const Database = require("better-sqlite3");
const logger = debug("hercules-base:db");

const db = new Database(process.env.HERCULES_BASE_DB, { verbose: logger });
const urlsSchema = fs.readFileSync(path.join(__dirname, "urls.sql"), { encoding: "utf8" });
const responsesSchema = fs.readFileSync(path.join(__dirname, "responses.sql"), { encoding: "utf8" });
db.prepare(urlsSchema).run();
db.prepare(responsesSchema).run();

module.exports = db;
