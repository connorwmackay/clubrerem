'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: false
    },
    username: {
      type: DataTypes.STRING,
      notNull: false
    },
    email: {
      type: DataTypes.STRING,
      notNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      notNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};