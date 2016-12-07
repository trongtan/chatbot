'use strict';

var groupButtonData = require('./../data/group-button-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('GroupButton', groupButtonData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('GroupButton', null, {});
  }
};
