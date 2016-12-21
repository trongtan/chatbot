import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants, payloadPrefixConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { Disease } from 'models';

export default class AskDiseaseMenuListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Disease Menu]';
    this.intentionalPayload = payloadConstants.SEARCH_BY_DISEASE_PAYLOAD;
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
