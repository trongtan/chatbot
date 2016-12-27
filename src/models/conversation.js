'use strict';
module.exports = function(sequelize, DataTypes) {
  var Conversation = sequelize.define('Conversation', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Conversation;
};