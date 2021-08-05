'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoomMember extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            
        }
    };
    RoomMember.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
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
        is_admin: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_moderator: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'RoomMember',
    });
    return RoomMember;
};