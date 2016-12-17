import EventEmitter from 'events';
import co from 'co';

import { Texts, Elements, ButtonTemplates, Diseases } from 'models';

import { BUILD_MESSAGE_EVENT, FINISHED_BUILD_MESSAGE } from 'utils/event-constants';
import { BUILD_TEXT_MESSAGE, BUILD_GENERIC_MESSAGE, BUILD_BUTTON_TEMPLATE_MESSAGE, BUILD_DISEASE_TEMPLATE_MESSAGE } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageTemplate) {
    super();
    this.messageTemplate = messageTemplate;
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_MESSAGE_EVENT, (senderId, payloads) => {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloads));
      this.buildMessageFromPayloads(senderId, payloads);
    });

    this.messageTemplate.on(FINISHED_BUILD_MESSAGE, message => {
      logger.info('[Message Producer] [FINISHED_BUILD_MESSAGE]: %s', JSON.stringify(message));
      this.emit(FINISHED_BUILD_MESSAGE, message);
    });
  }

  buildMessageFromPayloads(senderId, payloads) {
    const self = this;
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      const firstPayload = payloads[0];
      const secondPayload = payloads[1];

      const templateMessages = yield Texts.findAllByPostbackValue(firstPayload);
      const elementMessages = yield Elements.findAllByPostbackValue(firstPayload);
      const buttonTemplateMessages = yield ButtonTemplates.findAllByPostbackValue(firstPayload);
      const diseaseMessages = yield Diseases.findAllByPostbackValue(firstPayload, secondPayload);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(diseaseMessages));

      if (templateMessages.length > 0) {
        self.messageTemplate.emit(BUILD_TEXT_MESSAGE, senderId, templateMessages);
      } else if (elementMessages.length > 0) {
        self.messageTemplate.emit(BUILD_GENERIC_MESSAGE, senderId, elementMessages);
      } else if (buttonTemplateMessages.length > 0) {
        self.messageTemplate.emit(BUILD_BUTTON_TEMPLATE_MESSAGE, senderId, buttonTemplateMessages);
      } else if (diseaseMessages.length > 0) {
        self.messageTemplate.emit(BUILD_DISEASE_TEMPLATE_MESSAGE, senderId, diseaseMessages);
      }
    });
  }
}
