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

  return callSendAPI(messageData);
};
