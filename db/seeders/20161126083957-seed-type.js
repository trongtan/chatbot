'use strict';

var data = require('./../data/type-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Types', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Types', null, {});
  }
};
