'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TypeSynonym', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING,
      },
      typeId: {
        type: Sequelize.STRING,
        references: {
          model: 'Type',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('TypeSynonym');
  }
};
