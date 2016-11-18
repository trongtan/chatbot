'use strict';

var linkData = require('./../data/link-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Link', linkData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Link', null, {});
  }
};
