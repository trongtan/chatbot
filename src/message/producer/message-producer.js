import EventEmitter from 'events';
import co from 'co';
import async from 'async';

import { filter, map, split } from 'lodash';

import { Block } from 'models';
import { isContainRSSPayload } from 'utils/message-utils';
import { CATEGORY_TYPE, SUBCATEGORY_TYPE } from 'utils/constants';

import {
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE,
  BUILD_RSS_MESSAGE_EVENT,
  FINISHED_BUILD_RSS_MESSAGE_EVENT
} from 'utils/event-constants';
import {
  BUILD_TEXT_MESSAGE,
  BUILD_GENERIC_MESSAGE,
  BUILD_BUTTON_TEMPLATE_MESSAGE,
  BUILD_DISEASE_TEMPLATE_MESSAGE
} from 'utils/event-constants';

import { GENERAL_TYPE, INFORMATION_PREVENTION_TREATMENT_TYPE, DISEASE_TYPE } from 'utils/constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageTemplate, messageRSS) {
    super();
    this.messageTemplate = messageTemplate;
    this.messageRSS = messageRSS;
    this._listenEvent();
  }

  _listenEvent() {
    this.on(BUILD_MESSAGE_EVENT, (user, payloads) => {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT]: %s', JSON.stringify(payloads));

      this._buildMessageFromPayloads(user, payloads);
    });

    this.messageTemplate.on(FINISHED_BUILD_MESSAGE, message => {
      logger.info('[Message Producer] [FINISHED_BUILD_MESSAGE]: %s', JSON.stringify(message));
      this.emit(FINISHED_BUILD_MESSAGE, message);
    });

    this.messageRSS.on(FINISHED_BUILD_RSS_MESSAGE_EVENT, (user, messageType, templateMessages) => {
      if (templateMessages.length > 0) {
        switch (messageType) {
          case CATEGORY_TYPE:
            return this.messageTemplate.emit(BUILD_TEXT_MESSAGE, user, templateMessages);
          case SUBCATEGORY_TYPE:
            return this.messageTemplate.emit(BUILD_GENERIC_MESSAGE, user, templateMessages);
        }
      }
    });
  }

  _buildMessageFromPayloads(user, payloads) {
    logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][payload]: %s', JSON.stringify(payloads));
    return this._buildNormalMessage(user, payloads);
  }

  _buildNormalMessage(user, payloads) {
    const self = this;
    return co(function *() {
      const requestingPayloads = payloads[0];
      const blockId = split(requestingPayloads,'=')[1];
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(blockId));

      const messagesResponse = yield Block.getAllMessagesReponse(blockId);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Messages Response]: %s', JSON.stringify(messagesResponse));

      return messagesResponse;
    });
  }

  _filterRequestingPayloads(payloads) {
    return co(function *() {
      let returnedPayloads = [];
      const postbacks = yield Postback.getAllPostbackFromValues(payloads);

      const generalPayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == GENERAL_TYPE;
      });

      const infoPreventTreatmentPayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == INFORMATION_PREVENTION_TREATMENT_TYPE;
      });

      const diseasePayloads = filter(postbacks, (postback) => {
        return postback.Types.priority == DISEASE_TYPE;
      });

      if (infoPreventTreatmentPayloads.length == 0 && diseasePayloads.length == 0 && generalPayloads.length > 0) {
        returnedPayloads.push(generalPayloads);
      } else if (infoPreventTreatmentPayloads.length > 0 && diseasePayloads.length > 0) {
        infoPreventTreatmentPayloads.forEach(infoPreventTreatmentPayload => {
          diseasePayloads.forEach(diseasePayload => {
            returnedPayloads.push([infoPreventTreatmentPayload, diseasePayload]);
          });
        });

      }
      return returnedPayloads;
    });
  }

  _getMessageTemplateFromDatabase(user, payloads) {
    const self = this;
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      const firstPayload = payloads[0];
      const secondPayload = payloads[1];

      const templateMessages = yield Texts.findAllByPostbackValue(firstPayload);
      const elementMessages = yield Elements.findAllByPostbackValue(firstPayload);
      const buttonTemplateMessages = yield ButtonTemplates.findAllByPostbackValue(firstPayload);
      const diseaseMessages = yield Diseases.findAllByPostbackValue(firstPayload, secondPayload);

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][templateMessages]: %s', JSON.stringify(templateMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][elementMessages]: %s', JSON.stringify(elementMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][buttonTemplateMessages]: %s', JSON.stringify(buttonTemplateMessages));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][diseaseMessages]: %s', JSON.stringify(diseaseMessages));

      if (templateMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_TEXT_MESSAGE, user, templateMessages);
      } else if (elementMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_GENERIC_MESSAGE, user, elementMessages);
      } else if (buttonTemplateMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_BUTTON_TEMPLATE_MESSAGE, user, buttonTemplateMessages);
      } else if (diseaseMessages.length > 0) {
        return self.messageTemplate.emit(BUILD_DISEASE_TEMPLATE_MESSAGE, user, diseaseMessages);
      }
    });
  }
}
