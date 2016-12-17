export default (sequelize, DataTypes) => {
  const DiseaseArticle = sequelize.define('DiseaseArticle', {}, {
    classMethods: {}
  });
  return DiseaseArticle;
};
