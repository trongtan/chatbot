export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return Group;
};
