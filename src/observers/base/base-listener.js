import Promise from 'promise';

import messages from 'messages';
import services from 'services';
import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

export default class BaseListener {
  constructor() {
    this.tag = '';
  }

  _sendResponseMessage(metaData) {
    logger.info('%s Send Response Message (%s)', this.tag, JSON.stringify(metaData));
    return this._buildResponseMessage(metaData).then(message => {

      const { userId } = metaData.user;

      if (message) {
        logger.info('%sWrite response message %s to recipient %s', this.tag, JSON.stringify(message), userId);

        if (message.replyOptions) {
          return services.sendTextWithQuickReplyMessage(userId, message.text, message.replyOptions);
        } else {
          return services.sendTextMessage(userId, message.text);
        }
      } else {
        return Promise.resolve('Intentionally send no message to %s', userId);
      }
    });
  };

  _buildResponseMessage(metaData) {
    const { payload } = metaData;

    return Promise.resolve(getRandomObjectFromArray(messages[payload]));
  }
}
