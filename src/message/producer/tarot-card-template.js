import co from 'co';

import { filter, map, split, sortBy, concat, flatten, flattenDeep } from 'lodash';
import { User, Block, TarotCard, OpenedCard, Button } from 'models';

import { getRandomObjectFromArray } from 'utils/helpers.js';

import MessageTemplate from './message-template';

import {
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE
} from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class TarotCardTemplate extends MessageTemplate {
  buildTarotCardMessage(user, payloads, messageTemplateFromDatabase) {
    const self = this;
    return co(function *() {
      let tarotCardMessage = [];
      let openedCardToday = yield OpenedCard.getOpenedCardToday(user);

      if (self._isPlayedTarotCard(messageTemplateFromDatabase, openedCardToday)) {
        return yield self._buildPlayedTarotCardMessage(user);
      }

      if (self._isNotOpenedTarotCard(messageTemplateFromDatabase, openedCardToday)) {
        openedCardToday = yield self._openTarotCard(user, messageTemplateFromDatabase);
      }

      if (self._isAskingQuestion(payloads)) {
        const questionId = self._getQuestionIdFromPayloads(payloads);
        const selectedQuestion = yield OpenedCard.updateSelectedQuestion(openedCardToday.id, questionId);

        logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][UpdateSelectedQuestion]: %s', JSON.stringify(selectedQuestion));
        openedCardToday = yield OpenedCard.getOpenedCardToday(user);
      }

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][OpenedCardToday]: %s', JSON.stringify(openedCardToday));

      if (openedCardToday) {
        if (self._isRequestingOpenTarotCard(openedCardToday)) {
          tarotCardMessage = yield self._buildTarotCardGeneralMessage(user, openedCardToday);
        } else if (self._isRequestingShowMeaning(openedCardToday)) {
          tarotCardMessage = yield self._buildTarotCardMeaningMessage(user, openedCardToday);
        } else if (self._isRequestingQuestions(openedCardToday)) {
          tarotCardMessage = (openedCardToday.Question) ? yield self._buildAnswerMessage(user, openedCardToday) : self._buildQuestionsMessage(user, openedCardToday);
        }

        logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][TarotCardMessage]: %s', JSON.stringify(tarotCardMessage));
      }

      return flattenDeep(tarotCardMessage);
    });
  }

  _openTarotCard(user, messageTemplateFromDatabase) {
    return co(function *() {
      const tarotCardFromDatabase = getRandomObjectFromArray(messageTemplateFromDatabase.TarotCards);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][TarotCardFromDatabase]: %s', JSON.stringify(tarotCardFromDatabase));

      //FIXME: save selected tarot card to database here
      const openTarotCard = yield OpenedCard.saveOpenedTarotCard(user, tarotCardFromDatabase);
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildTarotCardMessage][OpenCard]: %s', JSON.stringify(openTarotCard));
      return yield OpenedCard.getOpenedCardToday(user);
    });
  }

  //FIXME: duplicate code here
  _buildNormalMessage(user, messageTemplateFromDatabase) {
    const self = this;
    return co(function *() {
      let builtMessages = [];
      const activeUser = yield User.findOrCreateById(user.userId);
      if (messageTemplateFromDatabase.Galleries && messageTemplateFromDatabase.Galleries.length > 0) {
        builtMessages.push(self.buildGalleryMessage(activeUser, messageTemplateFromDatabase.Galleries));
      }

      if (messageTemplateFromDatabase.TextCards && messageTemplateFromDatabase.TextCards.length > 0) {
        builtMessages.push(self.buildTextCardMessage(activeUser, messageTemplateFromDatabase.TextCards));
      }

      if (messageTemplateFromDatabase.Images && messageTemplateFromDatabase.Images.length > 0) {
        builtMessages.push(self.buildImageMessage(activeUser, messageTemplateFromDatabase.Images));
      }

      if (messageTemplateFromDatabase.QuickReplies && messageTemplateFromDatabase.QuickReplies.length > 0) {
        builtMessages.push(self.buildQuickReplyMessage(activeUser, messageTemplateFromDatabase.QuickReplies));
      }

      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][BuildNormalMessage]: %s', JSON.stringify(builtMessages));
      return flatten(builtMessages);
    });
  }

  //FIXME: duplicate code here
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

  _isPlayedTarotCard(messageTemplateFromDatabase, openedCardToday) {
    return (messageTemplateFromDatabase.Group && messageTemplateFromDatabase.Group.name === 'TAROT' &&
    openedCardToday && openedCardToday.isOpened && openedCardToday.isShownMeaning && openedCardToday.isAskQuestion);
  }

  _isNotOpenedTarotCard(messageTemplateFromDatabase, openedCardToday) {
    return (messageTemplateFromDatabase.TarotCards && messageTemplateFromDatabase.TarotCards.length > 0 && openedCardToday == null);
  }

  _getQuestionIdFromPayloads(payloads) {
    const question = split(payloads, '&')[1];
    const questionId = split(question, '=')[1];
    return questionId
  }

  _isAskingQuestion(payloads) {
    const question = split(payloads, '&')[1];
    const questionId = split(question, '=')[1];
    return (questionId != null);
  }

  _isRequestingOpenTarotCard(openedCardToday) {
    return (!openedCardToday.isOpened && !openedCardToday.isShownMeaning && !openedCardToday.isAskQuestion);
  }

  _isRequestingShowMeaning(openedCardToday) {
    return (openedCardToday.isOpened && !openedCardToday.isShownMeaning && !openedCardToday.isAskQuestion);
  }

  _isRequestingQuestions(openedCardToday) {
    return (openedCardToday.isOpened && openedCardToday.isShownMeaning && !openedCardToday.isAskQuestion);
  }

  _buildPlayedTarotCardMessage(user) {
    const self = this;
    return co(function *() {
      let messageTemplateFromDatabase = yield self._getMessageTemplateFromDatabase(['blockId=9']);
      return yield self._buildNormalMessage(user, messageTemplateFromDatabase);
    });
  }

  _buildTarotCardGeneralMessage(user, openedCardToday) {
    const self = this;
    return co(function *() {
      openedCardToday.TarotCard.TextCards = [openedCardToday.TarotCard.TextCards[0]];
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][OpenedCardTodayRemoveTextCard]: %s', JSON.stringify(openedCardToday));

      yield OpenedCard.updateCardOpen(openedCardToday.id);
      return yield self._buildNormalMessage(user, openedCardToday.TarotCard);
    });
  }

  _buildTarotCardMeaningMessage(user, openedCardToday) {
    const self = this;
    return co(function *() {
      openedCardToday.TarotCard.TextCards.shift();
      openedCardToday.TarotCard.Images.pop();

      yield OpenedCard.updateShownMeaning(openedCardToday.id);
      return yield self._buildNormalMessage(user, openedCardToday.TarotCard);
    });
  }

  _buildAnswerMessage(user, openedCardToday) {
    const self = this;
    return co(function *() {
      logger.info('[Message Producer] [BUILD_MESSAGE_EVENT][aaaaaa]: %s', JSON.stringify(openedCardToday.Question));

      const homeButton = yield Button.getButtonById('1');

      let tarotCardMessage = self.buildTextCardMessage(user, [{
        text: openedCardToday.Question.answer,
        order: 1,
        Buttons: [homeButton]
      }]);

      yield OpenedCard.updateAskQuestion(openedCardToday.id);
      return tarotCardMessage;
    });
  }

  _buildQuestionsMessage(user, openedCardToday) {
    if (openedCardToday.TarotCard.Questions && openedCardToday.TarotCard.Questions.length > 0) {
      let elements = [];
      openedCardToday.TarotCard.Questions.forEach(question => {
        elements.push({
          heading: question.question,
          imageURL: question.imageURL,
          subtitle: '',
          Buttons: [
            {
              name: 'Thầy phán　',
              Block: {
                id: '7&questionId=' + question.id
              }
            }
          ]
        })
      });

      return this.buildGalleryMessage(user, [{
        Elements: elements,
        order: 1
      }]);
    }
  }
}
