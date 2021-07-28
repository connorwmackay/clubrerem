const { Sequelize } = require('sequelize');
const User = require('./models/user');

const sequelize = new Sequelize('postgres://postgres:postgres@postgres:5432/postgres');

(async() => { try {
  await sequelize.authenticate();
  console.log("Connection to postgressql has been established properly.");
} catch(err) {
  console.error("Cannot connect to postgressql: ", err);
}})();

module.exports = sequelize;