'use strict';
var data = require('./../data/text-card.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TextCards', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TextCards', null, {});
  }
};
