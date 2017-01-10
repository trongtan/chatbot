export default (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Block;
};
