'use strict';
var data = require('./../data/gallery-button.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('GalleryButtons', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('GalleryButtons', null, {});
  }
};
