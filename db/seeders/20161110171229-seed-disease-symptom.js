'use strict';

var diseaseSymptomData = require('./../data/disease-symptom-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('DiseaseSymptom', diseaseSymptomData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('DiseaseSymptom', null, {});
  }
};
