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
    return this._buildResponseMessage(userId, payload).then(message => {
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
    });
  };

  _buildResponseMessage(userId, payload) {
    return Promise.resolve(getRandomObjectFromArray(messages[payload]));
  }
}
