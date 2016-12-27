'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Buttons', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      buttonTypeId: {
        type: Sequelize.STRING,
        references: {
          model: 'ButtonTypes',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      url: {
        type: Sequelize.STRING
      },
      title: {
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
    return queryInterface.dropTable('Buttons');
  }
};
