import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants } from 'utils/constants';
import { Keyword } from 'models';
import { logger } from 'logs/winston-logger';

export default class StartChatListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Start Chat]';
    this.intentionalPayload = payloadConstants.CHAT_PAYLOAD;
  }

  _buildResponseMessage(metaData) {
    logger.info('%s Build Response Message (%s)', this.tag, JSON.stringify(metaData));

    const { user } = metaData;
    const self = this;

    return co(function*() {
      const templateMessage = yield self._getTemplateMessageOfUser(user);
      return self._buildMessageOnTemplate(templateMessage, user);
    });
  }

  _getTemplateMessageOfUser(user) {
    logger.info('%s Get Template Message Of User (%s)', this.tag, JSON.stringify(user));

    const self = this;

    return co(function*() {
      let messageTemplate;

      if (user.parental) {
        messageTemplate = yield self._getTemplateMessage(payloadConstants.ASK_HEALTH_PAYLOAD);
      } else {
        messageTemplate = yield self._getTemplateMessage(payloadConstants.READY_TO_CHAT_PAYLOAD);
      }

      logger.info('%s Message Template (%s)', self.tag, JSON.stringify(messageTemplate));
      return messageTemplate;
    });
  }
}
