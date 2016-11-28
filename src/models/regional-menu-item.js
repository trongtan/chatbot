export default (sequelize, DataTypes) => {
  const RegionalMenuItem = sequelize.define('RegionalMenuItem', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    freezeTableName: true
  });

  return RegionalMenuItem;
};
