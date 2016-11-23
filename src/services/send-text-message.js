import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export const sendTextMessage = function (recipientId, messageText) {
  logger.info('Send Text Message (%s, %s)', recipientId, messageText);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: 'DEVELOPER_DEFINED_METADATA'
    }
  };

  return callSendAPI(messageData);
};
