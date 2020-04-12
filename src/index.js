require("dotenv").config();
const debug = require("debug");
const app = require("./app");

app.listen(process.env.HERCULES_BASE_PORT, () => {
    debug("hercules-base")(`Listening on ${process.env.HERCULES_BASE_PORT}.`);
});
