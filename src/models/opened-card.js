export default (sequelize, DataTypes) => {
  const OpenedCards = sequelize.define('OpenedCards', {
    dateOpened: DataTypes.DATE,
    cardName: DataTypes.STRING
  }, {
    classMethods: {
      saveOpenedTarotCard: (user, tarotCard) => {
        return OpenedCards.findOrCreate({
          where: {
            userId: user.userId,
            dateOpened: {
              $lt: new Date(),
              $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
          },
          defaults: {
            cardName: tarotCard.name,
            dateOpened: new Date(),
            userId: user.userId,
            tarotCardId: tarotCard.id
          }
        });
      }
    }
  });
  return OpenedCards;
};
