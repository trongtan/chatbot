'use strict';
var data = require('./../data/tarot-card.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('TarotCards', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('TarotCards', null, {});
  }
};
