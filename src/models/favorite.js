const Favorite = (sequelize, DataTypes) =>
    sequelize.define("Favorite", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    });

module.exports = Favorite;
