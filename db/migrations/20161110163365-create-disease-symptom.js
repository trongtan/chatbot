'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('DiseaseSymptom', {
      diseaseId: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Disease',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      symptomId: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Symptom',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('DiseaseSymptom');
  }
};
