'use strict';
module.exports = function (sequelize, DataTypes) {
  var ElementButton = sequelize.define('ElementButton', {}, {
    timestamps: false,
    classMethods: {}
  });
  return ElementButton;
};
