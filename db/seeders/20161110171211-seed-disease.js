'use strict';

var diseaseData = require('./../data/disease-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Disease', diseaseData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Disease', null, {});
  }
};
