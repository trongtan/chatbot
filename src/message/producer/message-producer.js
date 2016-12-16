import EventEmitter from 'events';
import Promise from 'promise';
import co from 'co';

import { User, Texts } from 'models';

import { BUILD_MESSAGE_EVENT, FINISHED_BUILD_MESSAGE } from 'utils/event-constants';
import { getRandomObjectFromArray } from 'utils/helpers';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor() {
    super();
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_MESSAGE_EVENT, (senderId, payloads) => {
      this.buildMessageFromPayloads(senderId, payloads).catch(error => {
        logger.error('[Message Producer] [Could not build message]: %s', JSON.stringify(error));
      });
    });
  }

  buildMessageFromPayloads(senderId, payloads) {
    logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloads));

    const self = this;
    return co(function *() {
      const templateMessages = yield Texts.findAllByPostbackValue(payloads[0]);

      if (templateMessages.length > 0) {
        const templateMessage = templateMessages[0];
        logger.info('[Message Producer] [Build Message From Payloads]: %s', JSON.stringify(templateMessage));

        if (templateMessage.Messages && !templateMessage.QuickReply ) {
          return yield self._buildTextMessageFromTemplate(senderId, templateMessage);
        }
      }
    });
  }

  _buildTextMessageFromTemplate(senderId, templateMessage) {
    const self = this;

    return co(function *() {
      const rawMessage = getRandomObjectFromArray(templateMessage.Messages);

      let textMessageStructure = require('./template/text-message.json');
      const message = yield self._bindPlaceHolderToTemplateMessage(rawMessage.message, senderId)
        .catch( error => {
        return Promise.reject(error);
      });

      textMessageStructure.message.text = message;
      textMessageStructure.recipient.id = senderId;

      return Promise.resolve(self.emit(FINISHED_BUILD_MESSAGE, textMessageStructure));
    });
  }

  _bindPlaceHolderToTemplateMessage(templateMessage, userId) {
    logger.info('Bind Place Holder To Template Message (%s), (%s)',
      JSON.stringify(templateMessage),
      JSON.stringify(userId));

    if (!templateMessage) return Promise.resolve('');
    if (!userId) return Promise.reject('UserId must be present');

    return co(function *() {
      const user = yield User.findOrCreateById(userId);
      if (user) {
        const { parental, firstName, lastName, childName } = user;
        const parentalStatus = User.getParentalName(parental);

        return templateMessage.replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${firstName} ${lastName}`)
          .replace(/\{\{childName}}/g, `${childName}`)
      }
    });
  }
}
