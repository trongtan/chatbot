export default (sequelize, DataTypes) => {
  const Block = sequelize.define('Blocks', {
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
