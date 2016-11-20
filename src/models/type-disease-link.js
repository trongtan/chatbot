export default (sequelize, DataTypes) => {
  const TypeDiseaseLink = sequelize.define('TypeDiseaseLink', {}, {
    freezeTableName: true
  });
  return TypeDiseaseLink;
};
