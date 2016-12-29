export default (sequelize, DataTypes) => {
  const ConversationDialog = sequelize.define('ConversationDialog', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ConversationDialog;
};
