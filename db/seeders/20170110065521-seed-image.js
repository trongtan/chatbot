'use strict';
var data = require('./../data/image.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Images', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Images', null, {});
  }
};
