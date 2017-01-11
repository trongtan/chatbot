'use strict';
var data = require('./../data/gallery.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Galleries', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Galleries', null, {});
  }
};
