export default (sequelize, DataTypes) => {
  const Symptom = sequelize.define('Symptom', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return Symptom;
};
