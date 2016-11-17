import { logger } from 'logs/winston-logger';
import { callSendAPI } from 'utils/service-utils';

export const sendTextWithQuickReplyMessage = function (recipientId, messageText, replyOptions) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      quick_replies: replyOptions
    }
  };

  logger.log('info', 'BBBBSend message %j', messageData);
  return callSendAPI(messageData);
};
