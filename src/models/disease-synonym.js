export default (sequelize, DataTypes) => {
  return sequelize.define('DiseaseSynonym', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });
};
