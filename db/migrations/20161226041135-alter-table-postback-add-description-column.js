'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Postback', 'description', {
      type: Sequelize.TEXT
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Postback', 'description');
  }
};
