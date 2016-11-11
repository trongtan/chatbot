export default (sequelize, DataTypes) => {
  const DiseaseSynonym = sequelize.define('DiseaseSynonym', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return DiseaseSynonym;
};
