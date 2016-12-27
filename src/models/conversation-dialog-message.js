export default (sequelize, DataTypes) => {
  const ConversationDialogMessage = sequelize.define('ConversationDialogMessage', {}, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ConversationDialogMessage;
};
