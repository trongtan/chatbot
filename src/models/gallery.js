export default (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Galleries', {
    title: DataTypes.STRING,
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
