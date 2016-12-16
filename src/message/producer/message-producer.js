import EventEmitter from 'events';
import co from 'co';

import { Texts, Elements } from 'models';

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
      //FIXME: We temporary handle first payload here.
      const firstPayload = payloads[0];
      const templateMessages = yield Texts.findAllByPostbackValue(firstPayload);
      const elementMessages = yield Elements.findAllByPostbackValue(firstPayload);

      logger.info('[Message Producer][Build Message From Payloads][data]: %s', JSON.stringify(elementMessages));

      let builtMessage;

      if (templateMessages.length > 0) {
        builtMessage = yield self._buildMessageFromText(senderId, templateMessages);
      } else if (elementMessages.length > 0) {
        builtMessage = self.messageBuilder.buildElementMessage(senderId, elementMessages);
      }

      logger.info('[Message Producer][Build Message From Payloads]: %s', JSON.stringify(builtMessage));
      if (builtMessage) {
        self.emit(FINISHED_BUILD_MESSAGE, builtMessage)
      }
    });
  }

  _buildMessageFromText(senderId, templateMessages) {
    const self = this;
    return co(function *() {
      const templateMessage = templateMessages[0];
      let builtMessage = require('./template/message.json');
      builtMessage.recipient.id = senderId;
      logger.info('[Message Producer] [Build Message From Payloads]: %s', JSON.stringify(templateMessage));

      if (templateMessage.Messages) {
        builtMessage.message.text = yield self.messageBuilder.buildTextMessage(senderId, templateMessage);
      }

      if (templateMessage.QuickReplies) {
        builtMessage.message.quick_replies = self.messageBuilder.buildQuickReplies(templateMessage.QuickReplies);
      }

      return builtMessage;
    });
  }
}
