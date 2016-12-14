'use strict';

var data = require('./../data/synonym-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Synonym', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Synonym', null, {});
  }
};
