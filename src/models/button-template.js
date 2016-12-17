export default (sequelize, DataTypes) => {
  const ButtonTemplate = sequelize.define('ButtonTemplate', {}, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ButtonTemplate;
};
