'use strict';

var data = require('./../data/message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Messages', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Messages', null, {});
  }
};
