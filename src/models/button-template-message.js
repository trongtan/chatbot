export default (sequelize, DataTypes) => {
  const ButtonTemplateMessage = sequelize.define('ButtonTemplateMessage', {}, {
    timestamps: false,
    classMethods: {}
  });
  return ButtonTemplateMessage;
};
