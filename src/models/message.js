export default (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    title: DataTypes.STRING,
    message: DataTypes.TEXT
  }, {
    classMethods: {
    }
  });
  return Message;
};
