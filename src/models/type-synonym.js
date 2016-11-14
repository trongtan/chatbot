export default (sequelize, DataTypes) => {
  return sequelize.define('TypeSynonym', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true
  });
};
