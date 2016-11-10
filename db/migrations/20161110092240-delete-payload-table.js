'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'currentPayloadId').then(function () {
      return queryInterface.dropTable('Payloads').then(function () {
        return queryInterface.addColumn('Users', 'currentPayload', {
          type: Sequelize.INTEGER
        })
      })
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Payloads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function () {
      return queryInterface.addColumn('Users', 'currentPayloadId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Payloads',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }).then(function () {
        return queryInterface.removeColumn('Users', 'currentPayload')
      })
    });
  }
};
