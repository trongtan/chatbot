'use strict';
module.exports = function (sequelize, DataTypes) {
  var Keyword = sequelize.define('Keyword', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsTo(models.Type);
      },
      findKeywordsFromMessage: function (message) {
        return Keyword.findAll();
      }
    }
  });
  return Keyword;
};
