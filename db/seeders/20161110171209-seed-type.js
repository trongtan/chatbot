'use strict';

var typeData = require('./../data/type-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Type', typeData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Type', null, {});
  }
};
