export default (sequelize, DataTypes) => {
  const QuickReply = sequelize.define('QuickReply', {
    contentType: DataTypes.STRING,
    title: DataTypes.STRING,
    imageURL: DataTypes.STRING
  }, {
    classMethods: {
    }
  });
  return QuickReply;
};
