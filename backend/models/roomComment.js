'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoomComment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    };
    RoomComment.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        content: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        member_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'RoomMember',
                key: 'id'
            }
        },
        room_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'Room',
                key: 'id'
            }
        },
    }, {
        sequelize,
        modelName: 'RoomComment',
    });
    return RoomComment;
};