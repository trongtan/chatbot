import { getRandomObjectFromArray } from 'utils/helpers';
import { GREETING_PAYLOAD } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import messages from './messages';

export const isGreeting = responseMessage => {
  return responseMessage && responseMessage.payload === GREETING_PAYLOAD;
};

export const handleGreetingMessage = (responseMessage, services) => {
  const recipientId = responseMessage.senderId;
  const message = _getGreetingResponseMessage();

  logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
  services.sendTextMessage(recipientId, message);
};

export const _getGreetingResponseMessage = function () {
  return getRandomObjectFromArray(messages).message;
};
