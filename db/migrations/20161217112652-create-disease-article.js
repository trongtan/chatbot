'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('DiseaseArticles', {
      diseaseId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Diseases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      articleId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('DiseaseArticles');
  }
};
