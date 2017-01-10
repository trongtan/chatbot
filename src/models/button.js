export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Button', {
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    URL: DataTypes.STRING,
    inAppBrowserSize: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Button;
};
