import { ConversationSteps, ConversationDialogs, QuickReplies } from 'models';

import { logger } from 'logs/winston-logger';

export default (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      findConversationDialog: (conversationId, step) => {
        return Conversation.findOne({
          include: [
            {
              model: ConversationSteps,
              as: 'ConversationSteps',
              where: {
                conversationId: conversationId,
                step: step
              },
              include: [
                {
                  model: ConversationDialogs,
                  as: 'ConversationDialogs',
                  include: [
                    {
                      model: QuickReplies,
                      as: 'QuickReplies',
                    }
                  ]
                }
              ]
            }
          ]
        });
      },
    }
  });

  return Conversation;
};
