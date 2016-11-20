'use strict';

var typeDiseaseLinkData = require('./../data/type-disease-link-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TypeDiseaseLink', typeDiseaseLinkData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TypeDiseaseLink', null, {});
  }
};
