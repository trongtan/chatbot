'use strict';

var groupMessageData = require('./../data/group-message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('GroupMessage', groupMessageData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('GroupMessage', null, {});
  }
};
