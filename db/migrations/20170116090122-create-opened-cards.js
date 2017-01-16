'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OpenedCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateOpened: {
        type: Sequelize.DATE
      },
      cardName: {
        type: Sequelize.STRING
      },
      isOpened: {
        type: Sequelize.BOOLEAN
      },
      isShownMeaning: {
        type: Sequelize.BOOLEAN
      },
      isAskQuestion: {
        type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'userId'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      tarotCardId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'TarotCards',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      questionId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'Questions',
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
    return queryInterface.dropTable('OpenedCards');
  }
};
