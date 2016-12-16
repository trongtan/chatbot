'use strict';
module.exports = function(sequelize, DataTypes) {
  var ElementButton = sequelize.define('ElementButton', {
    elementId: DataTypes.STRING,
    buttonId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ElementButton;
};