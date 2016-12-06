'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TypeDisease', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      diseaseId: {
        type: Sequelize.STRING,
        references: {
          model: 'Disease',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      typeId: {
        type: Sequelize.STRING,
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
