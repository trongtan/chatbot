export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Groups', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Group;
};
