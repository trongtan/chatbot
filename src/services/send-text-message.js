import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export const sendTextMessage = function (recipientId, messageText, metaData) {
  logger.info('Send Text Message (%s, %s)', recipientId, messageText);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: metaData
    }
  };

  return callSendAPI(messageData);
};
