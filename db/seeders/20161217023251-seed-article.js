'use strict';

var data = require('./../data/article-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Articles', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Articles', null, {});
  }
};
