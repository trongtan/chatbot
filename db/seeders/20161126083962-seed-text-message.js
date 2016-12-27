'use strict';

var data = require('./../data/text-message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TextMessages', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TextMessages', null, {});
  }
};
