export const isIntentionalPostback = (messageEvent, intentionalPostbackPayload) => {
  return !!(messageEvent && messageEvent.postback && messageEvent.postback.payload.includes(intentionalPostbackPayload));
};

export const isTextVisible = messageEvent => {
  return !!(messageEvent && messageEvent.message && messageEvent.message.text);
};

export const isSenderValid = messageEvent => {
  return !!(messageEvent && messageEvent.sender && messageEvent.sender.id);
};
