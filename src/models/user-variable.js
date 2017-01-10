export default (sequelize, DataTypes) => {
  const UserVariable = sequelize.define('UserVariable', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return UserVariable;
};
