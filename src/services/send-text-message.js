import { callSendAPI } from 'utils/service-utils';

export const sendTextMessage = function (recipientId, messageText) {
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
