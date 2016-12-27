'use strict';
export default (sequelize, DataTypes) => {
  const TextMessage = sequelize.define('TextMessage', {}, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TextMessage;
};
