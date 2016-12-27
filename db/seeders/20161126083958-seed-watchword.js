'use strict';

var watchwordData = require('./../data/watchword-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Watchword', watchwordData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Watchword', null, {});
  }
};
