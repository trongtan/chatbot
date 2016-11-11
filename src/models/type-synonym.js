export default (sequelize, DataTypes) => {
  const TypeSynonym = sequelize.define('TypeSynonym', {
    value: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  return TypeSynonym;
};
