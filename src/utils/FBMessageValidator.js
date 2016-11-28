export const isIntentionalPostback = (messageEvent, intentionalPostbackPayload) => {
  return !!(messageEvent && messageEvent.postback && messageEvent.postback.payload.includes(intentionalPostbackPayload));
};

export const isIntentionalQuickReply = (messageEvent, intentionalQuickReplyPayload) => {
  try {
    return messageEvent.message.quick_reply.payload.includes(intentionalQuickReplyPayload);
  } catch (exception) {
    return false;
  }
};

export const isTextVisible = messageEvent => {
  return !!(messageEvent && messageEvent.message && messageEvent.message.text);
};

export const isSenderValid = messageEvent => {
  return !!(messageEvent && messageEvent.sender && messageEvent.sender.id);
};
