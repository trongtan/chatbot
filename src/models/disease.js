import { Postback, Articles } from 'models';

export default (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      findAllByPostbackValue: (typePostback, diseasePostback) => {
        return Disease.findAll({
          include: [
            {
              model: Postback,
              as: 'TypePostback',
              where: {
                value: typePostback
              }
            },
            {
              model: Postback,
              as: 'DiseasePostback',
              where: {
                value: diseasePostback
              }
            },
            {
              model: Articles,
              as: "Articles"
            }]
        });
      }
    }
  });
  return Disease;
};
