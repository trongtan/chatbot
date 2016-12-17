'use strict';
module.exports = function(sequelize, DataTypes) {
  var PayloadButton = sequelize.define('PayloadButton', {
    messageId: DataTypes.STRING,
    postbackId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PayloadButton;
};