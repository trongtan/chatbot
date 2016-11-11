'use strict';
import {GET_STARTED_PAYLOAD} from 'utils/constants';

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    userId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
      },
      freezeTableName: true,
      tableName: 'User',
      saveProfileForUser: function (userId, userProfile) {
        var fullUserProfile = {
          userId: userId,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          gender: userProfile.gender
        }
        return User.findOrCreate({
          attributes: ['userId', 'firstName', 'lastName', 'lastName', 'gender'],
          where: {userId: userId},
          defaults: fullUserProfile});
      }
    }
  });
  return User;
};
