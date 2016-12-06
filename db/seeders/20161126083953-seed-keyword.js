'use strict';

var keywordData = require('./../data/keyword-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Keyword', keywordData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Keyword', null, {});
  }
};
