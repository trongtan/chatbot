'use strict';

var data = require('./../data/rss-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('RSSes', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('RSSes', null, {});
  }
};
