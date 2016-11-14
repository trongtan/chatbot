export default (sequelize, DataTypes) => {
  const DiseaseSynonym = sequelize.define('DiseaseSynonym', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    classMethods: {
      findAllDiseaseSynonyms: () => {
        return DiseaseSynonym.findAll({
          attributes: ['diseaseId', 'name'],
          raw: true
        });
      }
    }
  });

  return DiseaseSynonym;
};
