'use strict';

var data = require('./../data/conversation-dialog-quick-reply-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ConversationDialogQuickReplies', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ConversationDialogQuickReplies', null, {});
  }
};
