export default (sequelize, DataTypes) => {
  const TypeMessage = sequelize.define('TypeMessage', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return TypeMessage;
};
