"use strict";

class DataCollection {
    constructor(model) {
        this.model = model;
    }

    async get(id) {
        if (id) {
            return this.model.findOne({ where: { id } });
        } else {
            return this.model.findAll({});
        }
    }

    async create(record) {
        return this.model.create(record);
    }

    async update(id, data) {
        const record = await this.model.findOne({ where: { id } });
        if (record) {
            return record.update(data);
        } else {
            throw new Error(`Record with id ${id} not found.`);
        }
    }

    async delete(id) {
        const record = await this.model.findOne({ where: { id } });
        if (record) {
            return this.model.destroy({ where: { id } });
        } else {
            throw new Error(`Record with id ${id} not found.`);
        }
    }
}

module.exports = DataCollection;
