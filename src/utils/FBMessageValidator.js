export const isIntentionalPostback = (messageEvent, payload) => {
  return !!(messageEvent && messageEvent.postback && messageEvent.postback.payload === payload);
};

export const isTextVisible = messageEvent => {
  return !!(messageEvent && messageEvent.message && messageEvent.message.text);
};

export const isSenderValid = messageEvent => {
  return !!(messageEvent && messageEvent.sender && messageEvent.sender.id);
};
