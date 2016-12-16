'use strict';
module.exports = function(sequelize, DataTypes) {
  var Button = sequelize.define('Button', {
    url: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Button;
};
