export default (sequelize, DataTypes) => {
  const PersistentMenu = sequelize.define('PersistentMenu', {
    title: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {}
  });
  return PersistentMenu;
};
