export default (sequelize, DataTypes) => {
  const DiseaseMessage = sequelize.define('DiseaseMessage', {}, {
    timestamps: false,
    classMethods: {}
  });
  return DiseaseMessage;
};
