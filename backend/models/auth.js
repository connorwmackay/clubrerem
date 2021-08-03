'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Auth extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(Auth, {
                foreignKey: 'user_id'
            });
        }
    };
    Auth.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        key_hash: {
            type: DataTypes.STRING,
            unique: true,
            notNull: true
        },
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Auth',
    });
    return Auth;
};