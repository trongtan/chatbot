'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('User', 'favoriteTime', Sequelize.INTEGER);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('User', 'favoriteTime');
  }
};
