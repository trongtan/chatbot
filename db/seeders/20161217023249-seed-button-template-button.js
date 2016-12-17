'use strict';

var data = require('./../data/button-template-button-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ButtonTemplateButtons', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ButtonTemplateButtons', null, {});
  }
};
