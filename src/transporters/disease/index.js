import co from 'co';

import Models from 'models';
import { DISEASE_PAYLOAD } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export const isDiseaseResponse = responseMessage => {
  return responseMessage && responseMessage.payload === DISEASE_PAYLOAD;
};

export const handleDiseaseMessage = (responseMessage, services) => {
  const recipientId = responseMessage.senderId;

  co(function*() {
      const messages = yield _getDiseaseResponseMessage(responseMessage);

      messages.map(message => {
        logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
        services.sendTextMessage(recipientId, message);
      });
    }
  ).catch(exception => {
    logger.log('error', 'Got exeption %j on writing disease response message', exception);
  });
};

export const _getDiseaseResponseMessage = responseMessage => {
  const typeIds = responseMessage.typeIds;
  const diseaseIds = responseMessage.diseaseIds;

  return co(function*() {
    let articles = [];

    for (let typeId of typeIds) {
      for (let diseaseId of diseaseIds) {
        articles = [...articles, ...yield Models.TypeDisease.getArticles(typeId, diseaseId)];
      }
    }

    logger.log('info', 'Response message %j', articles);
    return articles;
  }).catch(exception => {
    logger.log('error', 'Got exeption %j on building disease response message', exception);
  });
};
