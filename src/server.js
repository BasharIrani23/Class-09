"use strict";

/// require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const pageNotFound = require("./error-handlers/404");
const serverError = require("./error-handlers/500");
const authRoutes = require("./routes/auth");
const routerApi = require("./routes/api-routes");
const logger = require("./middleware/logger");
const protectedRoute = require("./routes/protected-route");
app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        code: 200,
        message: "WELCOME",
    });
});

app.use("/api", routerApi);
app.use("protected", protectedRoute);
app.use(authRoutes);

app.use("*", pageNotFound);
app.use(serverError);

function start(port) {
    app.listen(port, () => console.log(`up and running on port: ${port}`));
}

module.exports = {
    app,
    start,
};
