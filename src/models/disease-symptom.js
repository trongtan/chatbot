export default (sequelize, DataTypes) => {
  const DiseaseSymptom = sequelize.define('DiseaseSymptom', {}, {
    freezeTableName: true
  });
  return DiseaseSymptom;
};
