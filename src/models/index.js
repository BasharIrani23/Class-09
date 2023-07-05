"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const DataCollection = require("./collection");
const dogModel = require("./dog");
const catModel = require("./cat");
const birdModel = require("./birds");
const hamsterModel = require("./hamster");
const favoriteModel = require("./favorite");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET;

const DB_URL =
    process.env.NODE_ENV === "test" ? "sqlite:memory:" : process.env.DB_URI;

let sequelizeOptions =
    process.env.NODE_ENV === "production"
        ? {
              dialectOptions: {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              },
          }
        : {};

const sequelize = new Sequelize(DB_URL, sequelizeOptions);

const userModel = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.beforeCreate(async (user) => {
        let hashedPass = await bcrypt.hash(user.password, 10);
        user.password = hashedPass;
    });

    User.authenticateBasic = async function (username, password) {
        const user = await this.findOne({ where: { userName: username } });

        if (!user) {
            throw new Error("Invalid Login");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error("Invalid Login");
        }

        return user;
    };

    User.bearerAuthChecker = async function (token) {
        const parsedToken = jwt.verify(token, secretKey);
        const user = await User.findOne({
            where: { userName: parsedToken.userName },
        });

        if (user.userName) {
            return user;
        } else {
            throw new Error("Invalid Token");
        }
    };

    return User;
};

const User = userModel(sequelize, DataTypes);
const dog = dogModel(sequelize, DataTypes);
const cat = catModel(sequelize, DataTypes);
const bird = birdModel(sequelize, DataTypes);
const hamster = hamsterModel(sequelize, DataTypes);
const favorite = favoriteModel(sequelize, DataTypes);

User.hasMany(favorite);
favorite.belongsTo(User);
User.hasMany(dog);
dog.belongsTo(User);
User.hasMany(cat);
cat.belongsTo(User);
User.hasMany(bird);
bird.belongsTo(User);
User.hasMany(hamster);
hamster.belongsTo(User);

module.exports = {
    db: sequelize,
    users: new DataCollection(User),
    dog: new DataCollection(dog),
    cat: new DataCollection(cat),
    bird: new DataCollection(bird),
    hamster: new DataCollection(hamster),
    favorite: new DataCollection(favorite),
};
