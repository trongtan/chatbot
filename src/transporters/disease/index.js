import { DISEASE_PAYLOAD } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export const isDiseaseResponse = responseMessage => {
  return responseMessage && responseMessage.payload === DISEASE_PAYLOAD;
};

export const handleDiseaseMessage = (responseMessage, services) => {
  const recipientId = responseMessage.senderId;
  const message = _getDiseaseResponseMessage();

  logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
  services.sendTextMessage(recipientId, message);
};

export const _getDiseaseResponseMessage = () => {
  return 'We detected your are asking something regards to disease';
};
