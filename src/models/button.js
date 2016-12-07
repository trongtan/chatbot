export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Button', {
    title: DataTypes.STRING,
    typeValue: DataTypes.STRING,
    postbackId: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return Button;
};
