import EventEmitter from 'events';
import Promise from 'promise';
import co from 'co';

import { Texts } from 'models';

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
      this.buildMessageFromPayloads(senderId, payloads);
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
      const message = getRandomObjectFromArray(templateMessage.Messages);

      let textMessageStructure = require('./template/text-message.json');
      textMessageStructure.message.text = message.message;
      textMessageStructure.recipient.id = senderId;

      return Promise.resolve(self.emit(FINISHED_BUILD_MESSAGE, textMessageStructure));
    });
  }
}
