export default (sequelize, DataTypes) => {
  const Element = sequelize.define('Element', {
    title: DataTypes.STRING,
    itemURL: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    subtitle: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Element;
};
