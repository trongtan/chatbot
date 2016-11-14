export default (sequelize, DataTypes) => {
  const TypeDisease = sequelize.define('TypeDisease', {
    articles: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    freezeTableName: true,
    classMethods: {
      getArticles: (typeId, diseaseId) => {
        return TypeDisease.findOne({
          attributes: ['articles'],
          where: {
            typeId: typeId,
            diseaseId: diseaseId
          },
          raw: true
        }).then(result => {
          return Promise.resolve(result && result.articles ? result.articles : []);
        });
      }
    }
  });

  return TypeDisease;
};
