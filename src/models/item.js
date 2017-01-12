export default (sequelize, DataTypes) => {
  const Item = sequelize.define('Items', {
    name: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Item;
};
