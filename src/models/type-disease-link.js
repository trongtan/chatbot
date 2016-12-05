export default (sequelize, DataTypes) => {
  const TypeDiseaseLink = sequelize.define('TypeDiseaseLink', {}, {
    freezeTableName: true,
    timestamps: false
  });
  return TypeDiseaseLink;
};
