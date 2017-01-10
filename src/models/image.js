export default (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    imageURL: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Image;
};
