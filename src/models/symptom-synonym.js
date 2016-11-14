export default (sequelize, DataTypes) => {
  const SymptomSynonym = sequelize.define('SymptomSynonym', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return SymptomSynonym;
};
