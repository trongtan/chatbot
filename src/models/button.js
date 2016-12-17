export default (sequelize, DataTypes) => {
  const Button = sequelize.define('Button', {
    url: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    classMethods: {}
  });
  return Button;
};
