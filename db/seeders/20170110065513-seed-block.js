'use strict';
var data = require('./../data/block.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Blocks', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Blocks', null, {});
  }
};
