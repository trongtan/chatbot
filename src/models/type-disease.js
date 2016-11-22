import Promise from 'promise';

export default (sequelize, DataTypes) => {
  const TypeDisease = sequelize.define('TypeDisease', {}, {
    freezeTableName: true,
    classMethods: {
      getArticles: (typeId, diseaseId) => {
        return TypeDisease.findAll({
          where: {
            typeId: typeId,
            diseaseId: diseaseId
          },
          include: [{ model: sequelize.model('Link') }],
          raw: true
        }).then(result => {
          if (result) {
            return Promise.resolve(result.map(item => {
              return {
                link: item['Links.link'],
                title: item['Links.title'],
                subtitle: item['Links.subtitle'],
                image: item['Links.image']
              }
            }));
          } else {
            return Promise.resolve([]);
          }
        });
      }
    }
  });

  return TypeDisease;
};
