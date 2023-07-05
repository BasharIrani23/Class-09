// hamster.js
"use strict";

const Hamster = (sequelize, DataTypes) =>
    sequelize.define("Hamster", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

module.exports = Hamster;
