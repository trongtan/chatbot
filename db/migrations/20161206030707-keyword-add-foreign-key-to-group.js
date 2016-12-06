'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Keyword',
      'groupId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'Group',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Keyword', 'groupId')
  }
};
