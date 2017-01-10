'use strict';
var data = require('./../data/group.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Groups', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Groups', null, {});
  }
};
