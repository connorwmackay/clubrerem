'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('Users', 'id');
  },

  down: async (queryInterface, Sequelize) => {
      
  }
};
