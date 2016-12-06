export default (sequelize, DataTypes) => {
  const groupMessage = sequelize.define('GroupMessage', {
    message: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return groupMessage;
};
