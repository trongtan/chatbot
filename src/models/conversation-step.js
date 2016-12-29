export default (sequelize, DataTypes) => {
  const ConversationStep = sequelize.define('ConversationStep', {
    step: DataTypes.INTEGER
  }, {
    classMethods: {}
  });
  return ConversationStep;
};
