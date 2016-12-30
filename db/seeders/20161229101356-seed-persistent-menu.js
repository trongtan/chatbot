'use strict';

var data = require('./../data/persistent-menu-data.json');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PersistentMenus', data, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PersistentMenus', null, {});
  }
};
