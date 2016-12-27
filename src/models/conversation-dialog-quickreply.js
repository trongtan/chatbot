export default (sequelize, DataTypes) => {
  const ConversationDialogQuickReply = sequelize.define('ConversationDialogQuickReply', {}, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return ConversationDialogQuickReply;
};
