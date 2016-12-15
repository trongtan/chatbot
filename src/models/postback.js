export default (sequelize, DataTypes) => {
  const Postback = sequelize.define('Postback', {
    value: DataTypes.STRING
  }, {
    classMethods: {
      freezeTableName: true,
      associate: function(models) {
      }
    }
  });
  return Postback;
};
