'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TextCards', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      order: {
        type: Sequelize.INTEGER
      },
      blockId: {
        type: Sequelize.STRING,
        references: {
          model: 'Blocks',
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
    return queryInterface.dropTable('TextCards');
  }
};
