'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GroupMessage', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      groupId: {
        type: Sequelize.STRING,
        references: {
          model: 'Group',
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('GroupMessage');
  }
};
