export default (sequelize, DataTypes) => {
  const ButtonTemplateMessage = sequelize.define('ButtonTemplateMessage', {}, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ButtonTemplateMessage;
};
