export default (sequelize, DataTypes) => {
  const Postback = sequelize.define('Postback', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
    }
  });
  return Postback;
};
