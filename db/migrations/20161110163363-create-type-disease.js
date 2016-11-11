'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TypeDisease', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      diseaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Disease',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Type',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      articles: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('TypeDisease');
  }
};
