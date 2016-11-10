'use strict';

var diseaseSynonymData = require('./../data/disease-synonym-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('DiseaseSynonym', diseaseSynonymData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('DiseaseSynonym', null, {});
  }
};
