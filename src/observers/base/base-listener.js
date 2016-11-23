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
    return this._buildResponseMessage(metaData).then((message, error) => {

      if (!error) {
        const { userId } = metaData.user;

        if (message) {
          logger.info('%sWrite response message %s to recipient %s', this.tag, JSON.stringify(message), userId);

          if (message.replyOptions) {
            return services.sendTextWithQuickReplyMessage(userId, message.text, message.replyOptions);
          } else if (message.buttons) {
            return services.sendTextWithButtons(userId, message.text, message.buttons);
          } else {
            return services.sendTextMessage(userId, message.text);
          }
        } else {
          return Promise.reject('%s Intentionally send no message to %s', userId);
        }
      } else {
        return Promise.reject('%s Cannot send message');
      }
    });
  };

  _buildResponseMessage(metaData) {
    const { user, payload } = metaData;

    let templateMessage = getRandomObjectFromArray(messages[payload]);

    if (user) {
      const { parental, firstName, lastName, childName } = user;
      const parentalStatus = this._getParentalName(parental);
      const message = {
        text: templateMessage.text
          .replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${firstName} ${lastName}`)
          .replace(/\{\{childName}}/g, `${childName}`),
        replyOptions: templateMessage.replyOptions
      };
      logger.info('%s Message built %s', this.tag, JSON.stringify(message));
      return Promise.resolve(message);
    }

    logger.info('%s Cannot build response message', this.tag);
    return Promise.reject(`${this.tag}Cannot build response message`);
  }

  _getParentalName(parental) {
    const parentalMap = {
      'DAD': 'Bố',
      'MOM': 'Mẹ',
      'NA': 'bạn'
    };
    return parentalMap[parental];
  }
}
