export default (sequelize, DataTypes) => {
  return sequelize.define('TypeDisease', {
    articles: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    freezeTableName: true
  });
};
