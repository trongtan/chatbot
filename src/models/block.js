import { Gallery, Element, TextCard, Image, QuickReply, Item, Button, TextCardButton, ElementButton, TarotCard } from 'models';

export default (sequelize, DataTypes) => {
  const Block = sequelize.define('Blocks', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      getAllMessagesReponse: (blockId) => {
        return Block.findOne({
          where: {
            id: blockId,
          },
          include: [
            {
              model: Gallery,
              as: 'Galleries',
              include: [
                {
                  model: Element,
                  as: 'Elements',
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
                }
              ]
            },
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
              model: QuickReply,
              as: 'QuickReplies',
              include: [
                {
                  model: Item,
                  as: 'Items'
                }
              ]
            },
            {
              model: TarotCard,
              as: 'TarotCards',
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
          ],
          order: [
            [ Gallery, 'order', 'ASC' ],
            [ TextCard, 'order', 'ASC' ],
            [ Image, 'order', 'ASC' ],
            [ QuickReply, 'order', 'ASC' ],
            [ Gallery, Element, 'order', 'ASC' ],
            [ QuickReply, Item, 'order', 'ASC' ],
            [ TextCard, Button, TextCardButton, 'order', 'ASC' ],
            [ Gallery, Element, Button, ElementButton, 'order', 'ASC' ],
            [ TarotCard, 'order', 'ASC' ],
            [ TarotCard, TextCard, 'order', 'ASC' ],
            [ TarotCard, TextCard, Button, TextCardButton, 'order', 'ASC' ],
            [ TarotCard, Image, 'order', 'ASC' ],
          ]
        });
      }
    }
  });
  return Block;
};
