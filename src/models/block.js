import { Gallery, TextCard, Image, QuickReply, Button } from 'models';

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
              as: 'QuickReplies'
            }
          ]
        });
      }
    }
  });
  return Block;
};
