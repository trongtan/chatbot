'use strict';

var data = require('./../data/conversation-dialog-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ConversationDialogs', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ConversationDialogs', null, {});
  }
};
