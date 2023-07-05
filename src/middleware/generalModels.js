"use strict";

const genralModles = require("../models/index");

module.exports = (req, res, next) => {
    const modelName = req.params.model;
    if (genralModles[modelName]) {
        req.model = genralModles[modelName];
        next();
    } else {
        next("Invalid Model");
    }
};
