import Promise from 'promise';

import messages from 'messages';
import services from 'services';
import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

export default class BaseListener {
  constructor() {
    this.tag = '';
  }

  _sendResponseMessage(dataAnalysis) {
    logger.info('%s Send Response Message (%s)', this.tag, JSON.stringify(dataAnalysis));
    return this._buildResponseMessage(dataAnalysis).then(message => {

      const { userId } = dataAnalysis.user;

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

  _buildResponseMessage(dataAnalysis) {
    const { payload } = dataAnalysis;

    return Promise.resolve(getRandomObjectFromArray(messages[payload]));
  }
}
