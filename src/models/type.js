export default (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    title: DataTypes.STRING,
    priority: DataTypes.INTEGER
  }, {});
  return Type;
};
