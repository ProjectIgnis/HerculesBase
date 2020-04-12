const debug = require("debug");
const express = require("express");
const morgan = require("morgan");
const logger = debug("hercules-base");

const app = express();
// combined + response time
app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms`));

app.get("/", (req, res) => res.sendStatus(204));

module.exports = app;
