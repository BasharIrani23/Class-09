"use strict";

const express = require("express");
const data = require("../models");
const generalModels = require("../middleware/generalModels");
const bearer = require("../middleware/bearer");
const acl = require("../middleware/acl");
const router = express.Router();

router.param("model", generalModels);

router.get("/:model", bearer, handleGetAll);
router.get("/:model/:id", bearer, handleGetOne);
router.post("/:model", bearer, acl("create"), handleCreate);
router.put("/:model/:id", bearer, acl("update"), handleUpdate);
router.delete("/:model/:id", bearer, acl("delete"), handleDelete);

async function handleGetAll(req, res, next) {
    try {
        let allRecords = await req.model.get();
        res.status(200).json(allRecords);
    } catch (err) {
        next(err);
    }
}

async function handleGetOne(req, res, next) {
    try {
        const id = req.params.id;
        const modelName = req.params.model;
        const model = data[modelName];

        if (modelName === "user") {
            const record = await model.authenticateBasic(id, req.body.password);
            res.status(200).json(record);
        } else if (modelName === "dog") {
            const dog = await model.get(id);
            const user = await dog.getUser();

            res.status(200).json({
                dog,
                user,
            });
        } else if (modelName === "cat") {
            const cat = await model.get(id);
            const user = await cat.getUser();

            res.status(200).json({
                cat,
                user,
            });
        } else if (modelName === "hamster") {
            const hamster = await model.get(id);
            const user = await hamster.getUser();

            res.status(200).json({
                hamster,
                user,
            });
        } else if (modelName === "favorite") {
            const favorite = await model.get(id);
            const user = await favorite.getUser();

            res.status(200).json({
                favorite,
                user,
            });
        } else {
            const theRecord = await model.get(id);
            res.status(200).json(theRecord);
        }
    } catch (err) {
        next(err);
    }
}

async function handleCreate(req, res, next) {
    try {
        const modelName = req.params.model;
        const model = data[modelName];
        let obj = req.body;
        let newRecord = await model.create(obj);
        res.status(201).json(newRecord);
    } catch (err) {
        next(err);
    }
}

async function handleUpdate(req, res, next) {
    try {
        const id = req.params.id;
        const modelName = req.params.model;
        const model = data[modelName];
        const obj = req.body;
        let updatedRecord = await model.update(id, obj);
        res.status(200).json(updatedRecord);
    } catch (err) {
        next(err);
    }
}

async function handleDelete(req, res, next) {
    try {
        const id = req.params.id;
        const modelName = req.params.model;
        const model = data[modelName];
        let deletedRecord = await model.delete(id);
        res.status(204).json(deletedRecord);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
