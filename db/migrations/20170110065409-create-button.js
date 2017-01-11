'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Buttons', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.INTEGER
      },
      blockId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Blocks',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      URL: {
        type: Sequelize.STRING
      },
      inAppBrowserSize: {
        type: Sequelize.INTEGER
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      galleryId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'Galleries',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      textCardId: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'TextCards',
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
    return queryInterface.dropTable('Buttons');
  }
};
