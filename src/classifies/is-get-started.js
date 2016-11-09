export const isGetStarted = function(messageEvent) {
  return messageEvent.postback.payload === 'USER_DEFINED_PAYLOAD';
};
