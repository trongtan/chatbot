import Promise from 'promise';

export default (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
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
      },
      getAllDiseases: () => {
        return Disease.findAll({
          attributes: ['id', 'name'],
          include: [{
            model: sequelize.model('Symptom'),
            as: 'symptoms',
            attributes: ['id', 'name'],
            include: [{
              model: sequelize.model('SymptomSynonym'),
              as: 'synonyms',
              attributes: ['name']
            }],
            through: { attributes: [] }
          }],
        })
      }
    },
  });

  return Disease;
};
