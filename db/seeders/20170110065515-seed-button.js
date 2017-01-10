'use strict';
var data = require('./../data/button.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Buttons', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Buttons', null, {});
  }
};
