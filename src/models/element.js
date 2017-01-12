export default (sequelize, DataTypes) => {
  const Element = sequelize.define('Elements', {
    imageURL: DataTypes.STRING,
    heading: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    URL: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Element;
};
