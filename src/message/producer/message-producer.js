import EventEmitter from 'events';
import co from 'co';

import { filter, map, split, sortBy, concat, flatten } from 'lodash';

import { Block, TarotCard } from 'models';
import { isContainRSSPayload } from 'utils/message-utils';
import { getRandomObjectFromArray } from 'utils/helpers.js';
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
    const self = this;
    return co(function *() {
      const messageTemplateFromDatabase = yield self._getMessageTemplateFromDatabase(payloads);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][MessageTemplateFromDatabase]: %s', JSON.stringify(messageTemplateFromDatabase));

      const normalMessages = self._buildNormalMessage(user, messageTemplateFromDatabase);
      const tarotCardMessage = self._buildTarotCardMessage(user, messageTemplateFromDatabase);

      self.emit(FINISHED_BUILD_MESSAGE, concat(normalMessages, tarotCardMessage));
    });
  }

  _buildNormalMessage(user, messageTemplateFromDatabase) {
    let builtMessages = [];

    if (messageTemplateFromDatabase.Galleries && messageTemplateFromDatabase.Galleries.length > 0) {
      builtMessages.push(this.messageTemplate.buildGalleryMessage(user, messageTemplateFromDatabase.Galleries));
    }

    if (messageTemplateFromDatabase.TextCards && messageTemplateFromDatabase.TextCards.length > 0) {
      builtMessages.push(this.messageTemplate.buildTextCardMessage(user, messageTemplateFromDatabase.TextCards));
    }

    if (messageTemplateFromDatabase.Images && messageTemplateFromDatabase.Images.length > 0) {
      builtMessages.push(this.messageTemplate.buildImageMessage(user, messageTemplateFromDatabase.Images));
    }

    if (messageTemplateFromDatabase.QuickReplies && messageTemplateFromDatabase.QuickReplies.length > 0) {
      builtMessages.push(this.messageTemplate.buildQuickReplyMessage(user, messageTemplateFromDatabase.QuickReplies));
    }

    logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildNormalMessage]: %s', JSON.stringify(builtMessages));
    return flatten(builtMessages);
  }

  _buildTarotCardMessage(user, messageTemplateFromDatabase) {
    if (messageTemplateFromDatabase.TarotCards && messageTemplateFromDatabase.TarotCards.length > 0) {
      const tarotCardFromDatabase = getRandomObjectFromArray(messageTemplateFromDatabase.TarotCards);
      //FIXME: save selected tarot card to database here
      const tarotCardMessages = this._buildNormalMessage(user, tarotCardFromDatabase);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildTarotCardMessage]: %s', JSON.stringify(tarotCardMessages));
      return tarotCardMessages;
    }
    return [];
  }

  _getMessageTemplateFromDatabase(payloads) {
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      const requestingPayloads = payloads[0];
      const blockId = split(requestingPayloads, '=')[1];

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(blockId));

      return yield Block.getAllMessagesReponse(blockId);
    });
  }
}
