'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GroupButton', {
      groupId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      buttonId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('GroupButton');
  }
};
