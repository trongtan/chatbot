import Promise from 'promise';

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
      },
      findDiseasesByIds: (ids) => {
        return Disease.findAll({
          attributes: ['name'],
          where: {
            id: {
              $in: ids
            }
          },
          raw: true
        }).then(diseases => {
          return Promise.resolve(diseases.map(disease => {
            return disease.value;
          }));
        });
      }
    },
  });
};
