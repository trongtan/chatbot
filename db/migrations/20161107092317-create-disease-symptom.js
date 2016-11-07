'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('DiseaseSymptoms', {
      diseaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Diseases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        primaryKey: true,
      },
        symptomId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Symptoms',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          primaryKey: true,
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
    return queryInterface.dropTable('DiseaseSymptoms');
  }
};
