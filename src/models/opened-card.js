import { Block, TextCard, Image, Button, TarotCard, TextCardButton, Question } from 'models';

export default (sequelize, DataTypes) => {
  const OpenedCards = sequelize.define('OpenedCards', {
    dateOpened: DataTypes.DATE,
    cardName: DataTypes.STRING,
    isOpened: DataTypes.BOOLEAN,
    isShownMeaning: DataTypes.BOOLEAN,
    isAskQuestion: DataTypes.BOOLEAN,
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
            tarotCardId: tarotCard.id,
            isOpened: false,
            isShownMeaning: false,
            isAskQuestion: false,
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
                },
                {
                  model: Question,
                  as: 'Questions'
                }
              ]
            },
            {
              model: Question,
              as: 'Question'
            }
          ]
        });
      },
      updateCardOpen: (openedTarotCardId) => {
        return OpenedCards.update({
          isOpened: true
        }, { where: { id: openedTarotCardId } });
      },
      updateShownMeaning: (openedTarotCardId) => {
        return OpenedCards.update({
          isShownMeaning: true
        }, { where: { id: openedTarotCardId } });
      },
      updateAskQuestion: (openedTarotCardId) => {
        return OpenedCards.update({
          isAskQuestion: true
        }, { where: { id: openedTarotCardId } });
      }
    }
  });
  return OpenedCards;
};
