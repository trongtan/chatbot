'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Images',
      'tarotCardId', {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'TarotCards',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Images', 'tarotCardId');
  }
};
