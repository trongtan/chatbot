import Promise from 'promise';

import { payloadConstants } from 'utils/constants';
import { getUserProfile } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    currentPayload: DataTypes.STRING,
    parental: DataTypes.STRING,
    childName: DataTypes.STRING,
    favoriteTime: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    classMethods: {
      _saveProfileForUser: (userId, userProfile) => {
        const fullUserProfile = {
          userId: userId,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          gender: userProfile.gender,
          currentPayload: payloadConstants.GET_STARTED_PAYLOAD
        };

        logger.log('info', 'Save to user profile to database %j', fullUserProfile);

        return User.findOrCreate({
          where: { userId: userId },
          defaults: fullUserProfile,
          raw: true
        });
      },
      findOrCreateById: (userId) => {
        return User.findOne({
          where: {
            userId: userId
          },
          raw: true
        }).then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return getUserProfile(userId).then(userProfile => {
              logger.info('Get user profile', JSON.stringify(userProfile));
              return User._saveProfileForUser(userId, userProfile);
            }).catch(() => {
              logger.error('Get error on getting user profile %s', userId);
              return Promise.reject(`Cannot get user profile of ${userId}`);
            });
          }
        });
      },
      updateParental: (userId, payload, parental) => {
        return User.update({
          parental: parental,
          currentPayload: payload
        }, { where: { userId: userId } });
      },
      updateChildName: (userId, childName) => {
        return User.update({
          childName: childName,
          currentPayload: payloadConstants.ASK_CHILD_NAME_PAYLOAD
        }, { where: { userId: userId } });
      },
      updateFavoriteTime: (userId, favoriteTime) => {
        return User.update({
          favoriteTime: favoriteTime,
          currentPayload: payloadConstants.ASK_FAVORITE_TIME_PAYLOAD
        }, { where: { userId: userId } });
      }
    }
  });

  return User;
};
