import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export const sendTextWithQuickReplyMessage = function (recipientId, messageText, replyOptions) {
  logger.info('Send Text With Quick Reply Message (%s, %s, %s)', recipientId, messageText, JSON.stringify(replyOptions));

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      quick_replies: replyOptions
    }
  };

  return callSendAPI(messageData);
};
