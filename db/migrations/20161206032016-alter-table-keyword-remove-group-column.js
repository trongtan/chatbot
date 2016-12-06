'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Keyword', 'group')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Keyword',
      'group',
      {
        type: Sequelize.STRING
      }
    )
  }
};
