export default (sequelize, DataTypes) => {
  const GroupButton = sequelize.define('GroupButton', {
    groupId: DataTypes.STRING,
    buttonId: DataTypes.STRING
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return GroupButton;
};
