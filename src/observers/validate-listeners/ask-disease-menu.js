import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants, payloadPrefixConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { Disease } from 'models';

export default class AskDiseaseMenuListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Disease Menu]';
    this.intentionalPostbackPayload = payloadConstants.SEARCH_BY_DISEASE_PAYLOAD;
  }

  _getTemplateMessage(payload) {
    logger.info('%s Get Template Message (%s)', this.tag, payload);

    const self = this;
    return co(function*() {
      const diseases = yield Disease.findAll({ raw: true });

      return { elements: self._buildDiseasesMessage(diseases) }
    });
  }

  _buildDiseasesMessage(diseases) {
    return diseases.map(disease => {
      return {
        title: disease.akaName,
        subtitle: disease.subtitle,
        image: disease.image,
        buttons: [
          {
            type: 'postback',
            title: 'Thông tin',
            payload: `${payloadPrefixConstants.GET_INFO_DISEASE}_${'INFORMATION'}_${disease.id}`
          },
          {
            type: 'postback',
            title: 'Cách phòng tránh',
            payload: `${payloadPrefixConstants.GET_INFO_DISEASE}_${'PRECAUTIONS'}_${disease.id}`
          },
          {
            type: 'postback',
            title: 'Cách điều trị',
            payload: `${payloadPrefixConstants.GET_INFO_DISEASE}_${'TREATMENTS'}_${disease.id}`
          }
        ]
      };
    });
  }
}
