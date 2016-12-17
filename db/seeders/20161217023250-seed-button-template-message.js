'use strict';

var data = require('./../data/button-template-message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ButtonTemplateMessages', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ButtonTemplateMessages', null, {});
  }
};
