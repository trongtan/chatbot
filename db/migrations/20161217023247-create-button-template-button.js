'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ButtonTemplateButtons', {
      buttonTemplateId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'ButtonTemplates',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      buttonId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Buttons',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ButtonTemplateButtons');
  }
};
