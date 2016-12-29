'use strict';
module.exports = function(sequelize, DataTypes) {
  var ConversationStep = sequelize.define('ConversationStep', {
    conversationId: DataTypes.STRING,
    dialogId: DataTypes.STRING,
    step: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ConversationStep;
};