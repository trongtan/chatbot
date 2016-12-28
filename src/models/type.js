export default (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    title: DataTypes.STRING,
    value: DataTypes.INTEGER
  }, {});
  return Type;
};
