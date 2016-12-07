import Promise from 'promise';
import co from 'co';

import messages from 'messages';
import services from 'services';
import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';
import { GroupMessage, Group, Button } from 'models';
import { map } from 'lodash';

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
      if (user) {
        let templateMessage = yield self._getTemplateMessage(payload);
        return self._buildMessageOnTemplate(templateMessage, user);
      }

      logger.info('%s Cannot build response message', this.tag);
      return Promise.reject(`${this.tag}Cannot build response message`);
    });
  }

  _buildMessageOnTemplate(templateMessage, user) {
    logger.info('%s Build Message On Template (%s)', this.tag, JSON.stringify(templateMessage), JSON.stringify(user));

    const { parental, firstName, lastName, childName } = user;
    const parentalStatus = this._getParentalName(parental);
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

    logger.info('%s Message built %s', this.tag, JSON.stringify(message));
    return Promise.resolve(message);
  }

  _getTemplateMessage(payload) {
    return co(function*() {
      let message = getRandomObjectFromArray(messages[payload]);
      if (!message) {
        const templateMessages = yield GroupMessage.findMesageByGroup(payload);
        const buttons = yield Button.findButtonsByGroup(payload);
        const templateMessage = getRandomObjectFromArray(templateMessages);

        message = {
          text: templateMessage.text,
          buttons: map(buttons, ({ title, typeValue, postbackName }) => {
            return { title, type: typeValue, payload: postbackName }
          })
        };

        logger.info('_getTemplateMessage %s', JSON.stringify(message));

      }
      return Promise.resolve(message);
    });
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
