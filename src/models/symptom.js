export default (sequelize, DataTypes) => {
  const Symptom = sequelize.define('Symptom', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        this.hasMany(models.SymptomSynonym);
        this.belongsToMany(models.Disease, {
          through: 'DiseaseSymptom'
        });
      }
    }
  });

  return Symptom;
};
