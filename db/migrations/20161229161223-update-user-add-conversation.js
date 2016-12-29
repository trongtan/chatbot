'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('User', 'chatting', Sequelize.BOOLEAN).then(() => {
      return queryInterface.addColumn('User', 'chatStep', Sequelize.INTEGER).then(() => {
        return queryInterface.addColumn('User', 'conversationId', Sequelize.STRING);
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('User', 'conversationId').then(() => {
      return queryInterface.removeColumn('User', 'chatStep').then(() => {
        return queryInterface.removeColumn('User', 'chatting');
      });
    });
  }
};
