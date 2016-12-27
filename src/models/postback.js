export default (sequelize, DataTypes) => {
  const Postback = sequelize.define('Postback', {
    value: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    freezeTableName: true,
    classMethods: {
    }
  });
  return Postback;
};
