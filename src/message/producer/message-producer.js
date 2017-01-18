import EventEmitter from 'events';
import co from 'co';

import { filter, map, split, sortBy, concat, flatten, flattenDeep } from 'lodash';

import { User, Block, TarotCard, OpenedCard, Button } from 'models';
import { getRandomObjectFromArray } from 'utils/helpers.js';

import {
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE
} from 'utils/event-constants';


import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor(messageTemplate, tarotCardMessage) {
    super();
    this.messageTemplate = messageTemplate;
    this.tarotCardMessage = tarotCardMessage;
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

      const tarotCardMessage = yield self.tarotCardMessage.buildTarotCardMessage(user, payloads, messageTemplateFromDatabase);
      const normalMessages = yield self._buildNormalMessage(user, messageTemplateFromDatabase);

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][TarotCardMessage]: %s', JSON.stringify(tarotCardMessage));
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][NormalMessages]: %s', JSON.stringify(normalMessages));

      let message = [];
      if (tarotCardMessage.length > 0) {
        message =tarotCardMessage;
      } else if (normalMessages.length > 0) {
        message = normalMessages;
      }

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Messages]: %s', JSON.stringify(message));

      self.emit(FINISHED_BUILD_MESSAGE, flattenDeep(message));
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

  _getMessageTemplateFromDatabase(payloads) {
    return co(function *() {
      //FIXME: We temporary handle first payload here.
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(payloads));
      const block = split(payloads, '&')[0];
      const blockId = split(block, '=')[1];

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][Block Id]: %s', JSON.stringify(blockId));

      return yield Block.getAllMessagesReponse(blockId);
    });
  }
}
