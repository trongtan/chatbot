export default (sequelize, DataTypes) => {
  const QuickReply = sequelize.define('QuickReplies', {
    title: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return QuickReply;
};
