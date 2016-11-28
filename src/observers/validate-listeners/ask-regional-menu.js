import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { RegionalMenuItem } from 'models';

export default class AskRegionalMenuListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Regional Menu]';
    this.intentionalPayload = payloadConstants.SEARCH_BY_REGION_PAYLOAD;
  }

  _getTemplateMessage(payload) {
    logger.info('%s Get Template Message (%s)', this.tag, payload);

    const self = this;
    return co(function*() {
      const menuItems = yield RegionalMenuItem.findAll({ raw: true });

      return { elements: self._buildRegionalMenu(menuItems) }
    });
  }

  _buildRegionalMenu(menuItems) {
    return menuItems.map(item => {
      return {
        title: item.title,
        subtitle: item.subtitle,
        image: item.image,
        buttons: [
          {
            type: 'postback',
            title: `Thông tin ${item.title}`,
            payload: 'UNSUPPORTED_PAYLOAD'
          }
        ]
      };
    });
  }
}
