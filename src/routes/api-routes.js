"use strict";

const express = require("express");

const genralModles = require("../middleware/generalModels");

const router = express.Router();

router.param("model", genralModles);

router.get("/:model", handleGetAll);
router.get("/:model/:id", handleGetOne);
router.post("/:model", handleCreate);
router.put("/:model/:id", handleUpdate);
router.delete("/:model/:id", handleDelete);

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

        if (modelName === "user") {
            const user = await req.model.get(id);
            const favorites = await user.getFavorites();

            res.status(200).json({
                user,
                favorites,
            });
        } else if (modelName === "dog") {
            const dog = await req.model.get(id);
            res.status(200).json(dog);
        } else if (modelName === "cat") {
            const cat = await req.model.get(id);
            res.status(200).json(cat);
        } else if (modelName === "hamster") {
            const hamster = await req.model.get(id);
            res.status(200).json(hamster);
        } else if (modelName === "bird") {
            const bird = await req.model.get(id);
            res.status(200).json(bird);
        } else {
            const theRecord = await req.model.get(id);
            res.status(200).json(theRecord);
        }
    } catch (err) {
        next(err);
    }
}

async function handleCreate(req, res, next) {
    try {
        let obj = req.body;
        obj.userId = req.userId; // Add the user ID to the object
        let newRecord = await req.model.create(obj);
        res.status(201).json(newRecord);
    } catch (err) {
        next(err);
    }
}

async function handleUpdate(req, res, next) {
    try {
        const id = req.params.id;
        const obj = req.body;
        let updatedRecord = await req.model.update(id, obj);
        res.status(200).json(updatedRecord);
    } catch (err) {
        next(err);
    }
}

async function handleDelete(req, res, next) {
    try {
        let id = req.params.id;
        let deletedRecord = await req.model.delete(id);
        res.status(204).json(deletedRecord);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
