'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('QuickReplies', {
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
      imageURL: {
        type: Sequelize.STRING
      },
      postbackId: {
        type: Sequelize.STRING,
        references: {
          model: 'Postback',
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
    return queryInterface.dropTable('QuickReplies');
  }
};
