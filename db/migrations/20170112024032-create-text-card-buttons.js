'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TextCardButtons', {
      textCardId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'TextCards',
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
    return queryInterface.dropTable('TextCardButtons');
  }
};
