'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TypeDiseases', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
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
      },
      //foreign key to Diseases
      diseaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Diseases',
          key: 'disease_id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Types',
          key: 'type_id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('TypeDiseases');
  }
};
