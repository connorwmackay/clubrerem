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
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    },
    profile: {
      type: DataTypes.STRING,
      notNull: false,
      defaultValue: "/images/defaultProfile.png"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};