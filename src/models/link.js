export default (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    freezeTableName: true,
    associate: function (models) {
      models.Link.belongsToMany(models.TypeDisease, {through: 'TypeDiseaseLink'});
    },
    classMethods: {
      associate: function (models) {
      }
    }
  });

  return Link;
};
