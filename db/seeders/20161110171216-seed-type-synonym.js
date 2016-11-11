'use strict';

var typeSynonymData = require('./../data/type-synonym-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TypeSynonym', typeSynonymData, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TypeSynonym', null, {});
  }
};
