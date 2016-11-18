'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('TypeDisease', 'articles');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('TypeDisease', 'articles', {
      type: Sequelize.ARRAY(Sequelize.STRING)
    })
  }
};
