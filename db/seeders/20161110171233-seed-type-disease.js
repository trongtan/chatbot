'use strict';

var typeDiseaseData = require('./../data/type-disease-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TypeDisease', typeDiseaseData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TypeDisease', null, {});
  }
};
