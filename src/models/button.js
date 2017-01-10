export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Buttons', {
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
