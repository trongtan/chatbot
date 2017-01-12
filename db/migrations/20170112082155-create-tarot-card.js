'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TarotCards', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      generalMeaning: {
        type: Sequelize.TEXT
      },
      isSpecial: {
        type: Sequelize.BOOLEAN
      },
      blockId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Blocks',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      order: {
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
    return queryInterface.dropTable('TarotCards');
  }
};
