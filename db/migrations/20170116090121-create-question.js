'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      question: {
        type: Sequelize.TEXT
      },
      answer: {
        type: Sequelize.TEXT
      },
      imageURL: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Questions');
  }
};
