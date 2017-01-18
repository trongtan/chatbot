import Promiss from 'promise';
import { Block, TextCard, Image, Button, TarotCard, TextCardButton, Question, OpenedCard } from 'models';
import moment from 'moment';
import { filter } from 'lodash';

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
        return OpenedCards.create({
          cardName: tarotCard.name,
          dateOpened: moment.utc(new Date()),
          userId: user.userId,
          tarotCardId: tarotCard.id,
          isOpened: false,
          isShownMeaning: false,
          isAskQuestion: false,
        });
      },
      getOpenedCardToday: (user) => {
        return OpenedCards.findAll({
          where: {
            userId: user.userId
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
          ],
          order: [
            [{
              model: TarotCard,
              as: 'TarotCard'
            }, {
              model: TextCard,
              as: 'TextCards'
            }, 'order', 'ASC'],

            [{
              model: TarotCard,
              as: 'TarotCard'
            }, {
              model: TextCard,
              as: 'TextCards'
            }, {
              model: Button,
              as: 'Buttons',
            }, TextCardButton, 'order', 'ASC'],

            [{
              model: TarotCard,
              as: 'TarotCard'
            }, {
              model: Question,
              as: 'Questions'
            }, 'order', 'ASC']

          ]
        }).then(openedCards => {
          console.log('aaaaaaa %j', openedCards);
          if (openedCards.length == 0) return Promiss.resolve(null);
          let filteredOpenedCard = filter(openedCards, openedCard => {
            console.log('aaaaaaa %j', moment.utc(openedCard.dateOpened));
            console.log('nnbbbbbbbb %j', moment.utc(new Date()));
            console.log('ccccccc %j', moment.utc(openedCard.dateOpened).isSame(moment.utc(new Date()), 'day'));

            return moment.utc(openedCard.dateOpened).isSame(moment.utc(new Date()), 'day');
          });

          return Promiss.resolve(filteredOpenedCard.length > 0 ? filteredOpenedCard[0] : null);
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
      },
      updateSelectedQuestion: (openedTarotCardId, questionId) => {
        return OpenedCards.update({
          questionId: questionId
        }, { where: { id: openedTarotCardId } });
      }
    }
  });
  return OpenedCards;
};
