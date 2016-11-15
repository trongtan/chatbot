import Promise from 'promise';
import co from 'co';

import services from 'services';
import AnalyzeListener from 'observers/base/analyze-listener';
import { TypeSynonym, DiseaseSynonym, TypeDisease, Type } from 'models';
import { logger } from 'logs/winston-logger';
import { DEFAULT_TYPE_KEYWORD } from 'utils/constants';

export default class AskDiseaseArticlesListener extends AnalyzeListener {
  _analyze(messageEvent) {
    if (!(messageEvent && messageEvent.message && messageEvent.message.text)) {
      return Promise.resolve({ isAskingDisease: false });
    }

    const text = messageEvent.message.text;
    return this._getRequest(text).then((res) => {
      if (res.requestedTypeIds.length > 0 && res.requestedDiseaseIds.length > 0) {
        return Promise.resolve({
          isAskingDisease: true,
          typeIds: res.requestedTypeIds,
          diseaseIds: res.requestedDiseaseIds
        });
      } else {
        return Promise.resolve({ isAskingDisease: false });
      }
    });
  }

  _handle(messageEvent, dataAnalysis) {
    if (dataAnalysis.isAskingDisease) {
      if (messageEvent && messageEvent.sender.id) {
        this._sendResponseMessage(messageEvent.sender.id, dataAnalysis.typeIds, dataAnalysis.diseaseIds);
      } else {
        logger.info('Sender id is invalid');
      }
    } else {
      logger.info('No data matches with request');
    }
  }

  _getRequest(message) {

    logger.log('info', 'Message: %j', message);

    return co(function *() {
      const typeSynonyms = yield TypeSynonym.findAllTypeSynonyms();
      const diseaseSynonyms = yield DiseaseSynonym.findAllDiseaseSynonyms();

      logger.log('info', 'List of typeSynonyms: %j', typeSynonyms);
      logger.log('info', 'List of diseaseSynonyms: %j', diseaseSynonyms);

      const requestedTypeSynonyms = typeSynonyms.filter(typeSynonym => {
        return message.indexOf(typeSynonym.value) !== -1;
      });

      const requestedDiseaseSynonyms = diseaseSynonyms.filter(diseaseSynonym => {
        return message.indexOf(diseaseSynonym.name) !== -1;
      });

      logger.log('info', 'List of requestedTypeSynonyms: %j', requestedTypeSynonyms);
      logger.log('info', 'List of requestedDiseaseSynonyms: %j', requestedDiseaseSynonyms);

      let requestedTypeIds = requestedTypeSynonyms.map(requestedTypeSynonym => {
        return requestedTypeSynonym.typeId;
      });

      const requestedDiseaseIds = requestedDiseaseSynonyms.map(requestedDiseaseSynonym => {
        return requestedDiseaseSynonym.diseaseId;
      });

      if (requestedTypeIds.length == 0) {
        requestedTypeIds.push(yield Type.findTypeIdByValue(DEFAULT_TYPE_KEYWORD));
      }

      logger.log('info', 'List of requestedTypeIds: %j', requestedTypeIds);
      logger.log('info', 'List of requestedDiseaseIds: %j', requestedDiseaseIds);

      return { requestedTypeIds, requestedDiseaseIds };
    });
  };

  _sendResponseMessage(recipientId, typeIds, diseaseIds) {
    const self = this;

    co(function*() {
        const articles = yield self._getDiseaseResponseMessage(typeIds, diseaseIds);

        if (articles.length > 0) {
          logger.log('info', 'Write response articles %j to recipient %j', articles, recipientId);
          services.sendCarouselMessage(recipientId, articles);
        }
      }
    ).catch(exception => {
      logger.error(`Got exception on writing disease response article ${exception}`);
    });
  };

  _getDiseaseResponseMessage(typeIds, diseaseIds) {
    return co(function*() {
      let articles = [];

      for (let typeId of typeIds) {
        for (let diseaseId of diseaseIds) {
          const additionalArticles = yield TypeDisease.getArticles(typeId, diseaseId);
          if (additionalArticles && additionalArticles.length > 0) {
            articles = [...articles, ...additionalArticles];
          }
        }
      }

      logger.log('info', 'Response message %j', articles);
      return articles;
    }).catch(exception => {
      logger.error(`Got on building disease response message ${exception}`);
    });
  }
}
