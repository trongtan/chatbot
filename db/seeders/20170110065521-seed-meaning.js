'use strict';
var data = require('./../data/meaning.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Meanings', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Meanings', null, {});
  }
};
