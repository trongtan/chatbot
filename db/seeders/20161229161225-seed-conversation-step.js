'use strict';

var data = require('./../data/conversation-step-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ConversationSteps', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ConversationSteps', null, {});
  }
};
