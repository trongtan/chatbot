'use strict';

var data = require('./../data/conversation-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Conversations', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Conversations', null, {});
  }
};
