"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;

const User = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("owner", "caretaker", "admin"),
            allowNull: false,
            defaultValue: "caretaker",
        },
        capabilities: {
            type: DataTypes.VIRTUAL,
            get() {
                const acl = {
                    owner: ["create", "read", "update", "delete"],
                    caretaker: ["read", "update"],
                    admin: ["create", "read", "update", "delete"],
                };
                return acl[this.role];
            },
        },
        token: {
            type: DataTypes.VIRTUAL,
        },
    });

    user.beforeCreate(async (user) => {
        let hashedPass = await bcrypt.hash(user.password, 10);
        user.password = hashedPass;
    });

    user.basicAuthChecker = async function (userName, password) {
        const user = await this.findOne({ where: { userName } });
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            const userToken = jwt.sign(
                { userName: user.userName, password: user.password },
                secretKey
            );
            console.log(userToken);
            return {
                user,
                token: userToken,
            };
        } else {
            throw new Error("Invalid User");
        }
    };

    user.bearerAuthChecker = async function (token) {
        const parsedToken = jwt.verify(token, secretKey);
        const user = await this.findOne({
            where: { userName: parsedToken.userName },
        });

        if (user.userName) {
            return user;
        } else {
            throw new Error("Invalid Token");
        }
    };

    return user;
};

module.exports = User;
