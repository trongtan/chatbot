'use strict';

var data = require('./../data/disease-message-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('DiseaseMessages', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('DiseaseMessages', null, {});
  }
};
