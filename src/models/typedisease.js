'use strict';
module.exports = function (sequelize, DataTypes) {
  var TypeDisease = sequelize.define('TypeDisease', {
    articles: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    classMethods: {
      associate: function (models) {
      }
    }
  });
  return TypeDisease;
};
