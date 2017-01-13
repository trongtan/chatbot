import { Block, TextCard, Image, Button, TarotCard, TextCardButton } from 'models';

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
      },
      getOpenedCardToday: (user) => {
        return OpenedCards.findOne({
          where: {
            userId: user.userId,
            dateOpened: {
              $lt: new Date(),
              $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
            }
          },
          include: [
            {
              model: TarotCard,
              as: 'TarotCard',
              include: [
                {
                  model: TextCard,
                  as: 'TextCards',
                  include: [
                    {
                      model: Button,
                      as: 'Buttons',
                      include: [
                        {
                          model: Block,
                          as: 'Block'
                        }
                      ]
                    }
                  ]
                },
                {
                  model: Image,
                  as: 'Images'
                }
              ]
            }
          ]
        });
      }
    }
  });
  return OpenedCards;
};
