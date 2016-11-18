export default (sequelize, DataTypes) => {
  const TypeDiseaseLink = sequelize.define('TypeDiseaseLink', {
    typeDiseaseId: DataTypes.INTEGER,
    linkId: DataTypes.INTEGER
  }, {
    freezeTableName: true
  });
  return TypeDiseaseLink;
};
