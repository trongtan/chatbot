'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Diseases', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      typePostbackId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Postback',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      diseasePostbackId: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('Diseases');
  }
};
