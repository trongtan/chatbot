import Promise from 'promise';
import co from 'co';

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
        } else if (message.buttons) {
          return services.sendTextWithButtons(userId, message.text, message.buttons);
        } else if (message.elements) {
          return services.sendCarouselMessage(userId, message.elements);
        } else {
          return services.sendTextMessage(userId, message.text);
        }
      } else {
        return Promise.reject('%s Intentionally send no message to %s', userId);
      }
    }, error => {
      return Promise.reject('%s Cannot send message %s', JSON.stringify(error));
    });
  };

  _buildResponseMessage(metaData) {
    logger.info('%s Build Response Message (%s)', this.tag, JSON.stringify(metaData));

    const { user, payload } = metaData;
    const self = this;

    return co(function*() {
      let templateMessage = yield self._getTemplateMessage(payload);

      if (user) {
        const { parental, firstName, lastName, childName } = user;
        const parentalStatus = self._getParentalName(parental);
        const text = !templateMessage.text ? '' : templateMessage.text
          .replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${firstName} ${lastName}`)
          .replace(/\{\{childName}}/g, `${childName}`);
        const message = {
          text: text,
          replyOptions: templateMessage.replyOptions,
          buttons: templateMessage.buttons,
          elements: templateMessage.elements
        };
        logger.info('%s Message built %s', self.tag, JSON.stringify(message));
        return Promise.resolve(message);
      }

      logger.info('%s Cannot build response message', self.tag);
      return Promise.reject(`${self.tag}Cannot build response message`);
    });
  }

  _getTemplateMessage(payload) {
    return Promise.resolve(getRandomObjectFromArray(messages[payload]));
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
