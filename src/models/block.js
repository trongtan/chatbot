import { Gallery, Element, TextCard, Image, QuickReply, Item, Button } from 'models';

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
            }
          ]
        });
      }
    }
  });
  return Block;
};
