'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Disease', 'akaName', Sequelize.STRING).then(function() {
      return queryInterface.addColumn('Disease', 'subtitle', Sequelize.STRING).then(function () {
        return queryInterface.addColumn('Disease', 'image', Sequelize.STRING)
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Disease', 'image').then(function() {
      return queryInterface.removeColumn('Disease', 'subtitle').then(function() {
        return queryInterface.removeColumn('Disease', 'akaName');
      });
    });
  }
};
