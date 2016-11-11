export default (sequelize, DataTypes) => {
  return sequelize.define('Symptom', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.SymptomSynonym);
        this.belongsToMany(models.Disease, {
          through: 'DiseaseSymptom'
        });
      }
    }
  });
};
