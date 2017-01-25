'use strict';
module.exports = function(sequelize, DataTypes) {
  var Meaning = sequelize.define('Meaning', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Meaning;
};