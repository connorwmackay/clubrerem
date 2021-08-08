'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    };
    Room.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            notNull: true
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            notNull: true
        },
        cover_photo_url: {
            type: DataTypes.STRING,
            notNull: true,
            defaultValue: '/images/base-cover.png'
        },
        is_invite_only: {
            type: DataTypes.BOOLEAN,
            notNull: true,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Room',
    });
    return Room;
};