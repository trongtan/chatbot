export const isValidSender = (messageEvent) => {
  return messageEvent &&
    messageEvent.sender &&
    messageEvent.sender.id;
};

export const isTextMessasge = (messageEvent) => {
  return messageEvent
    && messageEvent.message
    && messageEvent.message.text
    && !messageEvent.message.quick_reply;
};

export const isQuickReplyMessage = (messageEvent) => {
  return messageEvent
    && messageEvent.message
    && messageEvent.message.text
    && messageEvent.message.quick_reply;
};

export const isAttachmentMessage = (messageEvent) => {
  return messageEvent
    && messageEvent.message
    && messageEvent.message.text
    && messageEvent.message.attachments;
};

export const isPostbackmessage = (messageEvent) => {
  return messageEvent
    && messageEvent.postback;
};
