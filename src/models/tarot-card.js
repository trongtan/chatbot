export default (sequelize, DataTypes) => {
  const TarotCard = sequelize.define('TarotCards', {
    name: DataTypes.STRING,
    generalMeaning: DataTypes.STRING,
    isSpecial: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return TarotCard;
};
