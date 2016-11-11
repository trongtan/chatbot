import { logger } from 'logs/winston-logger';
import { GET_STARTED_PAYLOAD } from 'utils/constants';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    currentPayload: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      saveProfileForUser: (userId, userProfile) => {
        const fullUserProfile = {
          userId: userId,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          gender: userProfile.gender,
          currentPayload: GET_STARTED_PAYLOAD
        };

        logger.log('info', 'Save to user profile to database %j', fullUserProfile);

        return User.findOrCreate({
          attributes: ['userId', 'firstName', 'lastName', 'gender'],
          where: { userId: userId },
          defaults: fullUserProfile
        });
      }
    }
  });

  return User;
};
