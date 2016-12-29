'use strict';
module.exports = function(sequelize, DataTypes) {
  var ConversationDialog = sequelize.define('ConversationDialog', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    quickReplyId: DataTypes.STRING,
    messageId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ConversationDialog;
};
