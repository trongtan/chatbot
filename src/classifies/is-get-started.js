import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';

export const isGetStarted = function(messageEvent) {
  return messageEvent && messageEvent.postback && messageEvent.postback.payload === FACEBOOK_GET_STARTED_PAYLOAD;
};
