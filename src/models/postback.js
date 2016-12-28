export default (sequelize, DataTypes) => {
  const Postback = sequelize.define('Postback', {
    title: DataTypes.STRING,
    value: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    freezeTableName: true,
    classMethods: {
    }
  });
  return Postback;
};
