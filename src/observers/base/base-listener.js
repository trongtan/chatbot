import Promise from 'promise';

import messages from 'messages';
import services from 'services';
import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

export default class BaseListener {
  constructor() {
    this.tag = '';
  }

  _sendResponseMessage(userId, payload) {
    const recipientId = userId;
    const message = this._buildResponseMessage(payload);

    if (message) {
      logger.info('%sWrite response message %s to recipient %s', this.tag, JSON.stringify(message), recipientId);
      if (message.replyOptions) {
        return services.sendTextWithQuickReplyMessage(recipientId, message.text, message.replyOptions);
      } else {
        return services.sendTextMessage(recipientId, message.text);
      }
    } else {
      return Promise.resolve('Intentionally send no message to %s', recipientId);
    }
  };

  _buildResponseMessage(payload) {
    return getRandomObjectFromArray(messages[payload]);
  }
}
