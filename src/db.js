const fs = require("fs");
const path = require('path');

const debug = require("debug");
const Database = require("better-sqlite3");
const logger = debug("hercules-base:db");

const db = new Database(process.env.HERCULES_BASE_DB, { verbose: logger });
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), { encoding: "utf8" });
db.prepare(schema).run();

module.exports = db;
