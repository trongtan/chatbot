import EventEmitter from 'events';
import co from 'co';

import { filter, map, split, sortBy, concat, flatten, flattenDeep } from 'lodash';

import { User, Block, TarotCard, OpenedCard } from 'models';
import { getRandomObjectFromArray } from 'utils/helpers.js';

import {
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE
} from 'utils/event-constants';


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
      let messageTemplateFromDatabase;
      messageTemplateFromDatabase = yield self._getMessageTemplateFromDatabase(payloads);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][MessageTemplateFromDatabase]: %s', JSON.stringify(messageTemplateFromDatabase));

      let tarotCardMessage = [];

      const openedCardToday = yield OpenedCard.getOpenedCardToday(user);

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][OpenedCardToday]: %s', JSON.stringify(openedCardToday));
      if (openedCardToday) {
        tarotCardMessage = yield self._buildNormalMessage(user, openedCardToday.TarotCard);
        // messageTemplateFromDatabase = yield self._getMessageTemplateFromDatabase(['blockId=9']);
      } else {
        tarotCardMessage = yield self._buildTarotCardMessage(user, messageTemplateFromDatabase);
      }

      const normalMessages = yield self._buildNormalMessage(user, messageTemplateFromDatabase);

      self.emit(FINISHED_BUILD_MESSAGE, flattenDeep(concat(normalMessages, tarotCardMessage)));
    });
  }

  _buildNormalMessage(user, messageTemplateFromDatabase) {

    const self = this;
    return co(function *() {
      let builtMessages = [];
      const activeUser = yield User.findOrCreateById(user.userId);
      if (messageTemplateFromDatabase.Galleries && messageTemplateFromDatabase.Galleries.length > 0) {
        builtMessages.push(self.messageTemplate.buildGalleryMessage(activeUser, messageTemplateFromDatabase.Galleries));
      }

      if (messageTemplateFromDatabase.TextCards && messageTemplateFromDatabase.TextCards.length > 0) {
        builtMessages.push(self.messageTemplate.buildTextCardMessage(activeUser, messageTemplateFromDatabase.TextCards));
      }

      if (messageTemplateFromDatabase.Images && messageTemplateFromDatabase.Images.length > 0) {
        builtMessages.push(self.messageTemplate.buildImageMessage(activeUser, messageTemplateFromDatabase.Images));
      }

      if (messageTemplateFromDatabase.QuickReplies && messageTemplateFromDatabase.QuickReplies.length > 0) {
        builtMessages.push(self.messageTemplate.buildQuickReplyMessage(activeUser, messageTemplateFromDatabase.QuickReplies));
      }

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildNormalMessage]: %s', JSON.stringify(builtMessages));
      return flatten(builtMessages);
    });
  }

  _buildTarotCardMessage(user, messageTemplateFromDatabase) {
    const self = this;
    return co(function *() {
      let tarotCardMessage = [];

      if (messageTemplateFromDatabase.TarotCards && messageTemplateFromDatabase.TarotCards.length > 0) {
        const tarotCardFromDatabase = getRandomObjectFromArray(messageTemplateFromDatabase.TarotCards);
        logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][TarotCardFromDatabase]: %s', JSON.stringify(tarotCardFromDatabase));

        //FIXME: save selected tarot card to database here
        const openTarotCard = yield OpenedCard.saveOpenedTarotCard(user, tarotCardFromDatabase);
        logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildTarotCardMessage][OpenCard]: %s', JSON.stringify(openTarotCard));

        if (tarotCardFromDatabase.Images && tarotCardFromDatabase.Images.length > 0) {
          const imageMessage = flatten(self.messageTemplate.buildImageMessage(user, tarotCardFromDatabase.Images));
          logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][TarotImageMessage]: %s', JSON.stringify(imageMessage));

          tarotCardMessage.push(imageMessage);
        }
      }

      return flatten(tarotCardMessage);
    });
  }

  _buildTarotCardMeaningMessage(user, tarotCardFromDatabase) {
    const self = this;
    return co(function *() {
      const tarotCardMessages = yield self._buildNormalMessage(user, tarotCardFromDatabase);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildTarotCardMessage]: %s', JSON.stringify(tarotCardMessages));
      return tarotCardMessages;
    });
  }

  _getMessageTemplateFromDatabase(payloads) {
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(payloads));
      const blockId = split(payloads, '=')[1];

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(blockId));

      return yield Block.getAllMessagesReponse(blockId);
    });
  }
}
