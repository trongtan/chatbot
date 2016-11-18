'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('User', 'parental', Sequelize.STRING).then(() => {
      queryInterface.addColumn('User', 'childName', Sequelize.STRING);
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('User', 'childName').then(() => {
      queryInterface.removeColumn('User', 'parental');
    });
  }
};
