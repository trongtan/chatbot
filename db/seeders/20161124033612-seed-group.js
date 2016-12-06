'use strict';

var groupData = require('./../data/group-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Group', groupData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Group', null, {});
  }
};
