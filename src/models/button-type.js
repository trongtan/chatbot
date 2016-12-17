export default (sequelize, DataTypes) => {
  const ButtonType = sequelize.define('ButtonType', {
    value: DataTypes.STRING
  }, {
    classMethods: {}
  });
  return ButtonType;
};
