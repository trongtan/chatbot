export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      saveProfileForUser: (userId, userProfile) => {
        const fullUserProfile = {
          userId: userId,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          gender: userProfile.gender
        };

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
