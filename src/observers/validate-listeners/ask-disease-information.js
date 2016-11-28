import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadPrefixConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { Type, TypeDisease } from 'models';

export default class AskDiseaseInformationListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Disease Information]';
    this.intentionalPayload = payloadPrefixConstants.GET_INFO_DISEASE;
  }

  _getTemplateMessage(payload) {
    logger.info('%s Get Template Message (%s)', this.tag, payload);

    const self = this;
    return co(function*() {
      const { typeId, diseaseId } = yield self._getDiseaseIdAndTypeId(payload);
      const articles = yield TypeDisease.getArticles(typeId, diseaseId);

      return { elements: self._buildArticlesResponse(articles) }
    });
  }

  /** get diseaseId and typeId from payload whose format:
   `${payloadPrefixConstants.GET_INFO_DISEASE}_${'INFORMATION'}_${disease.id}`
   `${payloadPrefixConstants.GET_INFO_DISEASE}_${'PRECAUTIONS'}_${disease.id}`
   `${payloadPrefixConstants.GET_INFO_DISEASE}_${'TREATMENTS'}_${disease.id}`
   */
  _getDiseaseIdAndTypeId(payload) {
    const array = payload.split('_');
    const self = this;

    return co(function*() {
      return { diseaseId: array[array.length - 1], typeId: yield self._getTypeId(array[array.length - 2]) }
    });
  }

  _getTypeId(key) {
    const typeMap = {
      'INFORMATION': 'thong tin',
      'PRECAUTIONS': 'dieu tri',
      'TREATMENTS': 'de phong'
    };

    return Type.findTypeIdByValue(typeMap[key]);
  }

  _buildArticlesResponse(articles) {
    return articles.map(article => {
      return {
        link: article.link,
        title: article.title,
        subtitle: article.subtitle,
        image: article.image,
        buttons: [
          {
            type: 'web_url',
            url: article.link,
            title: 'Xem bài viết'
          }
        ]
      }
    });
  }
};
