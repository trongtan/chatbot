export default (sequelize, DataTypes) => {
  return sequelize.define('Disease', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        models.Disease.belongsToMany(models.Symptom, { through: 'DiseaseSymptom' });
        this.hasMany(models.DiseaseSynonym);
        this.hasMany(models.TypeDisease);
      }
    },
  });
};
