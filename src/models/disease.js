export default (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {
    name: DataTypes.STRING,
    akaName: DataTypes.STRING,
    image: DataTypes.STRING,
    subtitle: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return Disease;
};
