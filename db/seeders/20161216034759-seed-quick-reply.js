'use strict';

var data = require('./../data/quick-reply-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('QuickReplies', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('QuickReplies', null, {});
  }
};
