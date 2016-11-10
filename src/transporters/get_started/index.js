import { GET_STARTED_PAYLOAD } from 'utils/constants';
import messages from './messages';

export const isGetStarted = function (responseMessage) {
  return responseMessage && responseMessage.payload === GET_STARTED_PAYLOAD;
};

export const getGetStartedResponseMessage = function () {
  return messages[Math.floor((Math.random() * 100) % messages.length)].message;
};
