import EventEmitter from 'events';
import co from 'co';

import { Texts } from 'models';

import { BUILD_MESSAGE_EVENT, FINISHED_BUILD_MESSAGE } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageBuilder) {
    super();
    this.messageBuilder = messageBuilder;
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

        let builtMessage = require('./template/message.json');
        builtMessage.recipient.id = senderId;

        if (templateMessage.Messages) {
          builtMessage.message.text = yield self.messageBuilder.buildTextMessage(senderId, templateMessage);
        }

        if (templateMessage.QuickReplies) {
          builtMessage.message.quick_replies = self.messageBuilder.buildQuickReplies(templateMessage.QuickReplies);
        }

        if (builtMessage) {
          self.emit(FINISHED_BUILD_MESSAGE, builtMessage)
        }
      }
    });
  }
}
