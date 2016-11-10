'use strict';

var symptomData = require('./../data/symptom-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Symptom', symptomData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Symptom', null, {});
  }
};
