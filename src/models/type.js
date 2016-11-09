'use strict';
module.exports = function (sequelize, DataTypes) {
  var Type = sequelize.define('Type', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.TypeDisease);
      }
    }
  });
  return Type;
};
