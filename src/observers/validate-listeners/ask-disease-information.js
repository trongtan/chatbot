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
