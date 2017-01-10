export default (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
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
  return Gallery;
};
