'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Disease', 'akaName', Sequelize.STRING).then(function() {
      queryInterface.addColumn('Disease', 'subtitle', Sequelize.STRING).then(function () {
        queryInterface.addColumn('Disease', 'image', Sequelize.STRING)
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Disease', 'image').then(function() {
      queryInterface.removeColumn('Disease', 'subtitle').then(function() {
        queryInterface.removeColumn('Disease', 'akaName');
      });
    });
  }
};
