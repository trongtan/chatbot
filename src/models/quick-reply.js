export default (sequelize, DataTypes) => {
  const QuickReply = sequelize.define('QuickReply', {
    contentType: DataTypes.STRING,
    title: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return QuickReply;
};
