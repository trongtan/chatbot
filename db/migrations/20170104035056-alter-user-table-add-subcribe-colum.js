'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('User', 'subscribe', {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('User', 'subscribe');
  }
};
