'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TypeDiseaseLink', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeDiseaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TypeDisease',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      linkId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Link',
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
    return queryInterface.dropTable('TypeDiseaseLink');
  }
};
