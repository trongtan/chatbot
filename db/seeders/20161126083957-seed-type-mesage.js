'use strict';

var typeMessageData = require('./../data/type-message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TypeMessage', typeMessageData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TypeMessage', null, {});
  }
};
