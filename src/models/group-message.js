export default (sequelize, DataTypes) => {
  const GroupMessage = sequelize.define('GroupMessage', {
    message: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return GroupMessage;
};
