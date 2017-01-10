export default (sequelize, DataTypes) => {
  const QuickReply = sequelize.define('QuickReply', {
    name: DataTypes.STRING,
    userVariableId: DataTypes.STRING,
    parentOrder: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return QuickReply;
};
