'use strict';
var data = require('./../data/element.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Elements', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Elements', null, {});
  }
};
