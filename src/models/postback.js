'use strict';
module.exports = function(sequelize, DataTypes) {
  var Postback = sequelize.define('Postback', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      freezeTableName: true,
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Postback;
};
