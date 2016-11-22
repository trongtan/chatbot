import Promise from 'promise';
import co from 'co';

import services from 'services';
import AnalyzeListener from 'observers/base/analyze-listener';
import { Disease } from 'models';
import { logger } from 'logs/winston-logger';

export default class AskDiseaseBySymptomsListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Disease By Symptoms]';
  }

  _validate(text, userId) {
    logger.info('%s Validate (%s, %s)', this.tag, text, userId);

    return this._getRequest(text).then(res => {
      if (res.requestedDiseaseIds.length > 0) {
        return Promise.resolve({
          shouldHandle: true,
          userId: userId,
          diseaseIds: res.requestedDiseaseIds
        });
      } else {
        return Promise.resolve({ shouldHandle: false });
      }
    }).catch(exception => {
      logger.error('%sGot exception on getRequest: %s', this.tag, exception);
    });
  }

  _getRequest(message) {
    logger.info('%s Get request (%s)', this.tag, message);

    return co(function *() {
      const symptomSynonyms = yield Disease.getAllDiseases();

      const symptomMatches = symptomSynonyms.map(symptomSynonym => {

      });
      logger.error('%s: %s', 'AAAAAAA', JSON.stringify(symptomSynonyms));
      return {
        requestedDiseaseIds: message === 'abcxyz' ? [1, 2] : []
      };
    });
  };

  _execute(dataAnalysis) {
    logger.info('%s Execute %s', this.tag, JSON.stringify(dataAnalysis));
    const { userId, diseaseIds } = dataAnalysis;

    return this._sendResponseMessage(userId, diseaseIds);
  }

  _sendResponseMessage(recipientId, diseaseIds) {
    logger.info('%s Send response message (%s, %s)', this.tag, recipientId, diseaseIds);

    const self = this;

    return co(function*() {
        // const diseases = self._getDiseaseResponseMessage(diseaseIds);
        const diseases = [
          {
            title: 'Cam lanh',
            subtitle: 'Cam lanh Cam lanh Cam lanh Cam lanh',
            image: 'https://goo.gl/xvCFaV',
            link: 'http://www.webtretho.com/forum/f3604/luu-y-benh-ve-ho-hap-cho-tre-khi-giao-mua-1765203/'
          },
          {
            title: 'Ho hap',
            subtitle: 'Ho hap Ho hap Ho hap Ho hap',
            image: 'https://goo.gl/xvCFaV',
            link: 'http://www.webtretho.com/forum/f3604/luu-y-benh-ve-ho-hap-cho-tre-khi-giao-mua-1765203/'
          }
        ];

        logger.log('%sWrite response diseases %j to recipient %j', this.tag, diseases, recipientId);


        if (diseases.length > 0) {
          logger.log('%sWrite response diseases %j to recipient %j', this.tag, diseases, recipientId);
          return services.sendCarouselMessage(recipientId, diseases);
        }
      }
    ).catch(exception => {
      logger.error(`${this.tag} Got exception on writing disease response message ${exception}`);
    });
  };

  _getDiseaseResponseMessage(diseaseIds) {
    logger.info('%s Get disease response message (%s)', this.tag, diseaseIds);
    const self = this;

    return co(function*() {
      const diseases = [
        {
          title: 'Cam lanh',
          subtitle: 'Cam lanh Cam lanh Cam lanh Cam lanh',
          image: 'https://goo.gl/xvCFaV',
          link: 'http://www.webtretho.com/forum/f3604/luu-y-benh-ve-ho-hap-cho-tre-khi-giao-mua-1765203/'
        },
        {
          title: 'Ho hap',
          subtitle: 'Ho hap Ho hap Ho hap Ho hap',
          image: 'https://goo.gl/xvCFaV',
          link: 'http://www.webtretho.com/forum/f3604/luu-y-benh-ve-ho-hap-cho-tre-khi-giao-mua-1765203/'
        }
      ];

      logger.info('%s Response message %j', self.tag, JSON.stringify(diseases));
      return diseases;
    }).catch(exception => {
      logger.error(`Got on building disease response message ${exception}`);
    });
  }
}
