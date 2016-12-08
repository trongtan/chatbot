'use strict';

var quickReplyData = require('./../data/quick-reply-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('QuickReply', quickReplyData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuickReply', null, {});
  }
};
