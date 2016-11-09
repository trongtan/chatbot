'use strict';
module.exports = function (sequelize, DataTypes) {
  var Disease = sequelize.define('Disease', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.TypeDisease);
      }
    }
  });

  return Disease;
};
