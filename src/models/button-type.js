export default (sequelize, DataTypes) => {
  const ButtonType = sequelize.define('ButtonType', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ButtonType;
};
