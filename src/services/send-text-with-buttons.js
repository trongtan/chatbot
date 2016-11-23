import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export const sendTextWithButtons = function (recipientId, messageText, buttons) {
  logger.info('Send Message With Buttons (%s, %s, %s)', recipientId, messageText, JSON.stringify(buttons));

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: messageText,
          buttons: buttons
        }
      }
    }
  };

  return callSendAPI(messageData);
};
