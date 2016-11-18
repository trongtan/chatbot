import { logger } from 'logs/winston-logger';
import { payloadConstants } from 'utils/constants';

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
    childName: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      saveProfileForUser: (userId, userProfile) => {
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
          defaults: fullUserProfile
        });
      },
      getCurrentPayload: (userId) => {
        return User.findOne({
          attributes: ['currentPayload'],
          where: {
            userId: userId
          },
          raw: true
        });
      },
      updateCurrentPayload: (userId, currentPayload) => {
        return User.update({ currentPayload: currentPayload }, { where: { userId: userId } });
      },
      updateParental: (userId, parental) => {
        return User.update({
          parental: parental,
          currentPayload: payloadConstants.ASK_PARENT_PAYLOAD
        }, { where: { userId: userId } });
      }
    }
  });

  return User;
};
