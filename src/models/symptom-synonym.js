export default (sequelize, DataTypes) => {
  return sequelize.define('SymptomSynonym', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });
};
