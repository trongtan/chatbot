import Promise from 'promise';
import co from 'co';

import services from 'services';
import AnalyzeListener from 'observers/base/analyze-listener';
import { TypeSynonym, DiseaseSynonym, TypeDisease, Type } from 'models';
import { logger } from 'logs/winston-logger';
import { DEFAULT_TYPE_KEYWORD } from 'utils/constants';

export default class AskDiseaseArticlesListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Disease Articles]';
  }

  _validate(text, userId) {
    logger.info('%s Validate (%s, %s)', this.tag, text, userId);

    return this._getRequest(text).then(res => {
      if (res.requestedTypeIds.length > 0 && res.requestedDiseaseIds.length > 0) {
        return Promise.resolve({
          shouldHandle: true,
          userId: userId,
          typeIds: res.requestedTypeIds,
          diseaseIds: res.requestedDiseaseIds
        });
      } else {
        return Promise.resolve({ shouldHandle: false });
      }
    });
  }

  _getRequest(message) {
    logger.info('%s Get request (%s)', this.tag, message);

    return co(function *() {
      const typeSynonyms = yield TypeSynonym.findAllTypeSynonyms();
      const diseaseSynonyms = yield DiseaseSynonym.findAllDiseaseSynonyms();

      const requestedTypeSynonyms = typeSynonyms.filter(typeSynonym => {
        return message.indexOf(typeSynonym.value) !== -1;
      });

      const requestedDiseaseSynonyms = diseaseSynonyms.filter(diseaseSynonym => {
        return message.indexOf(diseaseSynonym.name) !== -1;
      });

      let requestedTypeIds = requestedTypeSynonyms.map(requestedTypeSynonym => {
        return requestedTypeSynonym.typeId;
      });

      const requestedDiseaseIds = requestedDiseaseSynonyms.map(requestedDiseaseSynonym => {
        return requestedDiseaseSynonym.diseaseId;
      });

      if (requestedTypeIds.length == 0) {
        requestedTypeIds.push(yield Type.findTypeIdByValue(DEFAULT_TYPE_KEYWORD));
      }

      return { requestedTypeIds, requestedDiseaseIds };
    }).catch(exception => {
      logger.error('%sGot exception on getRequest: %s', this.tag, exception);
    });
  };

  _execute(dataAnalysis) {
    logger.info('%s Execute %s', this.tag, JSON.stringify(dataAnalysis));
    const { userId, typeIds, diseaseIds } = dataAnalysis;

    return this._sendResponseMessage(userId, typeIds, diseaseIds);
  }

  _sendResponseMessage(recipientId, typeIds, diseaseIds) {
    logger.info('%s Send response message (%s, %s, %s)', this.tag, recipientId, typeIds, diseaseIds);

    const self = this;

    return co(function*() {
        const articles = yield self._getDiseaseResponseMessage(typeIds, diseaseIds);

        if (articles.length > 0) {
          logger.log('info', 'Write response articles %j to recipient %j', articles, recipientId);
          return services.sendCarouselMessage(recipientId, articles);
        }
      }
    ).catch(exception => {
      logger.error(`${this.tag} Got exception on writing disease response article ${exception}`);
    });
  };

  _getDiseaseResponseMessage(typeIds, diseaseIds) {
    logger.info('%s Get disease response message (%s, %s)', this.tag, typeIds, diseaseIds);
    const self = this;

    return co(function*() {
      let articles = [];

      for (let typeId of typeIds) {
        for (let diseaseId of diseaseIds) {
          const additionalArticles = yield TypeDisease.getArticles(typeId, diseaseId);
          logger.info('%s Get articles %j', self.tag, JSON.stringify(additionalArticles));

          if (additionalArticles && additionalArticles.length > 0) {
            articles = [...articles, ...additionalArticles];
          }
        }
      }

      logger.info('%s Response message %j', self.tag, JSON.stringify(articles));
      return articles;
    }).catch(exception => {
      logger.error(`Got on building disease response message ${exception}`);
    });
  }
}
