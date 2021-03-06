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
    username: { // TODO: Make this column unique
      type: DataTypes.STRING,
      unique: true,
      notNull: true
    },
    email: {
      type: DataTypes.STRING,
      notNull: true
    },
    password_hash: {
      type: DataTypes.STRING,
      notNull: true
    },
    profile: {
      type: DataTypes.STRING,
      notNull: true,
      defaultValue: "/images/defaultProfile.png"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};