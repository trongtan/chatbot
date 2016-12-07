'use strict';

var buttonData = require('./../data/button-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Button', buttonData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Button', null, {});
  }
};
