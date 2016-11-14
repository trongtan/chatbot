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
      const articles = yield _getDiseaseResponseMessage(responseMessage);

      articles.map(article => {
        logger.log('info', 'Write response article %j to recipient %j', article, recipientId);
        services.sendTextMessage(recipientId, article);
      });
    }
  ).catch(exception => {
    logger.error('error', `Got exeption on writing disease response article ${exception}`);
  });
};

const _getDiseaseResponseMessage = responseMessage => {
  const typeIds = responseMessage.typeIds;
  const diseaseIds = responseMessage.diseaseIds;

  return co(function*() {
    let articles = [];

    for (let typeId of typeIds) {
      for (let diseaseId of diseaseIds) {
        const additionalArticles = yield Models.TypeDisease.getArticles(typeId, diseaseId);
        if (additionalArticles && additionalArticles.length > 0) {
          articles = [...articles, ...additionalArticles];
        }
      }
    }

    logger.log('info', 'Response message %j', articles);
    return articles;
  }).catch(exception => {
    logger.error('error', `Got on building disease response message ${exception}`);
  });
};
