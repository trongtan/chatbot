'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('QuickReply', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      contentType: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      imageUrl: {
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
      payloadId: {
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('QuickReply');
  }
};
