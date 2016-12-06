export default (sequelize, DataTypes) => {
  const group = sequelize.define('Group', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true
  });
  return group;
};
