'use strict';
module.exports = function(sequelize, DataTypes) {
  var TarotCard = sequelize.define('TarotCard', {
    name: DataTypes.STRING,
    generalMeaning: DataTypes.STRING,
    isSpecial: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TarotCard;
};