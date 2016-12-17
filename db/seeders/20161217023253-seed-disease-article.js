'use strict';

var data = require('./../data/disease-article-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('DiseaseArticles', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('DiseaseArticles', null, {});
  }
};
