'use strict';

var data = require('./../data/element-button-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ElementButtons', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ElementButtons', null, {});
  }
};
