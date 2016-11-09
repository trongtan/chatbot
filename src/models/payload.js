'use strict';
module.exports = function (sequelize, DataTypes) {
  var Payload = sequelize.define('Payload', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
      }
    }
  });
  return Payload;
};
