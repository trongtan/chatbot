'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'TextCards',
      'meaningId', {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Meanings',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('TextCards', 'meaningId');
  }
};
