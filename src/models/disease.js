export default (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {}, {
    classMethods: {}
  });
  return Disease;
};
