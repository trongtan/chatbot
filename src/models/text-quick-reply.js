'use strict';
export default (sequelize, DataTypes) => {
  const TextQuickReply = sequelize.define('TextQuickReply', {}, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TextQuickReply;
};
