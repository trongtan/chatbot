'use strict';

var data = require('./../data/text-quick-reply-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TextQuickReplies', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TextQuickReplies', null, {});
  }
};
