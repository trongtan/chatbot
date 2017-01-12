'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ElementButtons', {
      elementId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Elements',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      buttonId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Buttons',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      order: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ElementButtons');
  }
};
