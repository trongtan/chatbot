'use strict';

var data = require('./../data/button-template-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ButtonTemplates', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ButtonTemplates', null, {});
  }
};
