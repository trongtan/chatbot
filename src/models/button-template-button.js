export default (sequelize, DataTypes) => {
  const ButtonTemplateButton = sequelize.define('ButtonTemplateButton', {}, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ButtonTemplateButton;
};
