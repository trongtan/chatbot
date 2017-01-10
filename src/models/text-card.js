export default (sequelize, DataTypes) => {
  const TextCard = sequelize.define('TextCard', {
    text: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return TextCard;
};
