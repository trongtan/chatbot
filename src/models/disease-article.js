export default (sequelize, DataTypes) => {
  const DiseaseArticle = sequelize.define('DiseaseArticle', {}, {
    timestamps: false,
    classMethods: {}
  });
  return DiseaseArticle;
};
