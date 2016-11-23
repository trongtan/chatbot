import { callSendAPI } from 'utils/service-utils';

export const sendMessageWithButtons = function (recipientId, messageText, buttons) {
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
