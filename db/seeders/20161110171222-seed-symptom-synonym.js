'use strict';

var symptomSynonymData = require('./../data/symptom-synonym-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SymptomSynonym', symptomSynonymData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('SymptomSynonym', null, {});
  }
};
