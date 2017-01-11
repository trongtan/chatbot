import EventEmitter from 'events';
import co from 'co';

import { filter, map, split, sortBy, concat } from 'lodash';

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
  }

  _buildMessageFromPayloads(user, payloads) {
    logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][payload]: %s', JSON.stringify(payloads));
    return this._buildNormalMessage(user, payloads);
  }

  _buildNormalMessage(user, payloads) {
    const self = this;
    return co(function *() {
      const messageTemplateFromDatabase = yield self._getMessageTemplateFromDatabase(payloads);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][MessageTemplateFromDatabase]: %s', JSON.stringify(messageTemplateFromDatabase));
      const builtMessages = map(messageTemplateFromDatabase, (message) => {
        return self.messageTemplate.buildTextCardMessage(user, message);
      });

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildNormalMessage]: %s', JSON.stringify(builtMessages));

      self.emit(FINISHED_BUILD_MESSAGE, builtMessages);
    });
  }

  _getMessageTemplateFromDatabase(payloads) {
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      const requestingPayloads = payloads[0];
      const blockId = split(requestingPayloads,'=')[1];
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(blockId));

      const messagesResponse = yield Block.getAllMessagesReponse(blockId);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Messages Response]: %s', JSON.stringify(messagesResponse));

      let messages = sortBy(concat(messagesResponse.Galleries, messagesResponse.TextCards, messagesResponse.Images, messagesResponse.QuickReplies), 'order');

      //FIXME: Remember to sort quick reply in right order

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Messages Response Sorted]: %s', JSON.stringify(messages));

      return messages;
    });
  }
}
