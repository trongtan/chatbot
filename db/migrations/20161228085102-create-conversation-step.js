'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ConversationSteps', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      conversationId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Conversations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      dialogId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'ConversationDialogs',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      step: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('ConversationSteps');
  }
};
