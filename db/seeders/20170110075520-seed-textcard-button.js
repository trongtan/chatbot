'use strict';
var data = require('./../data/textcard-button.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TextCardButtons', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TextCardButtons', null, {});
  }
};
