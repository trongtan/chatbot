export default (sequelize, DataTypes) => {
  const ButtonTemplateButton = sequelize.define('ButtonTemplateButton', {}, {
    timestamps: false,
    classMethods: {}
  });
  return ButtonTemplateButton;
};
