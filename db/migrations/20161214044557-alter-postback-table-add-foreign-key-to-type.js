'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Postback', 'typeId', {
      type: Sequelize.STRING,
      references: {
        model: 'Types',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Postback', 'typeId');
  }
};
