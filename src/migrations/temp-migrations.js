'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('Users', 'profile', {
        type: Sequelize.STRING,
        notNull: false,
        defaultValue: "/images/defaultProfile.png"
      });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('Users', 'profile');
  }
};
