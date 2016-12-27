'use strict';

var data = require('./../data/button-type-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ButtonTypes', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ButtonTypes', null, {});
  }
};
