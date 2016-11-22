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
      }
    },
  });

  return Disease;
};
