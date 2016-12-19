import EventEmitter from 'events';
import co from 'co';
import async from 'async';

import { isEmpty } from 'lodash';
import { Texts, Elements, ButtonTemplates, Diseases } from 'models';

import { BUILD_MESSAGE_EVENT, FINISHED_BUILD_MESSAGE } from 'utils/event-constants';
import {
  BUILD_TEXT_MESSAGE,
  BUILD_GENERIC_MESSAGE,
  BUILD_BUTTON_TEMPLATE_MESSAGE,
  BUILD_DISEASE_TEMPLATE_MESSAGE
} from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageTemplate) {
    super();
    this.messageTemplate = messageTemplate;
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_MESSAGE_EVENT, (senderId, payloadsDefinition) => {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloadsDefinition));

      if (isEmpty(payloadsDefinition)) {
        payloadsDefinition.push({
          type: 'button_template',
          payloads: ['UNSUPPORTED_PAYLOAD']
        });
      }

      this.buildMessageFromPayloads(senderId, payloadsDefinition);
    });

    this.messageTemplate.on(FINISHED_BUILD_MESSAGE, message => {
      logger.info('[Message Producer] [FINISHED_BUILD_MESSAGE]: %s', JSON.stringify(message));
      this.emit(FINISHED_BUILD_MESSAGE, message);
    });
  }

  buildMessageFromPayloads(senderId, payloadsDefinitions) {
    logger.info('[Message Producer] [Build Message From Payload]: %s', JSON.stringify(payloadsDefinitions));
    async.eachSeries(payloadsDefinitions, payloadsDefinition => {
      this._buildMessageFromPayloadDefinitions(senderId, payloadsDefinition);
    });
  }

  _buildMessageFromPayloadDefinitions(senderId, payloadsDefinition) {
    const self = this;
    logger.info('[Message Producer] [Build Message From Payload Definitions]: %s', JSON.stringify(payloadsDefinition));

    return co(function*() {
      let firstPayload = payloadsDefinition.payloads[0];
      let secondPayload = null;

      if (payloadsDefinition.payloads.length > 1) {
        secondPayload = payloadsDefinition.payloads[1];
      }

      const templateMessages = yield Texts.findAllByPostbackValue(firstPayload);
      const elementMessages = yield Elements.findAllByPostbackValue(firstPayload);
      const buttonTemplateMessages = yield ButtonTemplates.findAllByPostbackValue(firstPayload);
      let diseaseMessages = [];
      if (secondPayload) {
        diseaseMessages = yield Diseases.findAllByPostbackValue(firstPayload, secondPayload);
      }



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
