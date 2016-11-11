'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('DiseaseSymptom', {
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
      symptomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Symptom',
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('DiseaseSymptom');
  }
};
