'use strict';

var data = require('./../data/disease-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Diseases', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Diseases', null, {});
  }
};
