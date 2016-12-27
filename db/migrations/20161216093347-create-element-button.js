'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('ElementButtons', {
      elementId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Elements',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      buttonId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Buttons',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('ElementButtons');
  }
};
