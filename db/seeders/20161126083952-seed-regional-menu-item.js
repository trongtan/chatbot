'use strict';

var keywordData = require('./../data/regional-menu-item-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('RegionalMenuItem', keywordData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('RegionalMenuItem', null, {});
  }
};
