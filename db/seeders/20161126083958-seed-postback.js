'use strict';

var data = require('./../data/postback-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Postback', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Postback', null, {});
  }
};
