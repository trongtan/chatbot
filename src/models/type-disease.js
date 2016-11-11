module.exports = function (sequelize, DataTypes) {
  const TypeDisease = sequelize.define('TypeDisease', {
    articles: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    freezeTableName: true
  });

  return TypeDisease;
};
