'use strict';

var data = require('./../data/text-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Texts', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Texts', null, {});
  }
};
