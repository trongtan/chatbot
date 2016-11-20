export default (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return Link;
};
