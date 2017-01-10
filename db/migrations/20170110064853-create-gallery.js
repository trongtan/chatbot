'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Galleries', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      imageURL: {
        type: Sequelize.STRING
      },
      heading: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      URL: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Galleries');
  }
};
