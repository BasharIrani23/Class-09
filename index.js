"use strict";

require("dotenv").config();
const { db } = require("./src/models/index");
const server = require("./src/server");
const PORT = process.env.PORT || 3001;

db.sync({ force: true }).then(() => {
    server.start(PORT);
});
