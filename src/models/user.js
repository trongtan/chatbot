import Promise from 'promise';

import { OpenedCard, TarotCard } from 'models';

import { payloadConstants } from 'utils/constants';
import Utils from 'utils';

import { logger } from 'logs/winston-logger';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING
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
        }).spread(user => {
          return Promise.resolve(user);
        });
      },
      findOrCreateById: (userId) => {
        return User.findOne({
          where: {
            userId: userId
          },
          include: [
            {
              model: OpenedCard,
              as: 'OpenedCards',
              include: [
                {
                  model: TarotCard,
                  as: 'TarotCard'
                }
              ]
            }
          ]
        }).then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return Utils.getUserProfile(userId).then(userProfile => {
              logger.info('Get user profile', JSON.stringify(userProfile));
              return User._saveProfileForUser(userId, JSON.parse(userProfile));
            }).catch(() => {
              logger.error('Get error on getting user profile %s', userId);
              return Promise.reject(`Cannot get user profile of ${userId}`);
            });
          }
        });
      },
    }
  });

  return User;
};
