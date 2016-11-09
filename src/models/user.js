'use strict';
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    userId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsTo(models.Payload);
      }
    }
  });
  return User;
};
