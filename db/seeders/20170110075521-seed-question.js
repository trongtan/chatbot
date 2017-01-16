'use strict';
var data = require('./../data/question.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Questions', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
