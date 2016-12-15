import EventEmitter from 'events';
import co from 'co';

import { uniq, concat } from 'lodash';

import { Synonym, Watchword } from 'models';

import { HANDLE_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class TextMessageHandler extends EventEmitter {
  constructor() {
    super();
    this.on(HANDLE_MESSAGE_EVENT, (classifier, messageEvent) => {
      logger.info('Handle Text Message: %s', JSON.stringify(messageEvent));
      const self = this;

      return co(function *() {
        const payloads = yield self.findPostbackInMessageEvent(messageEvent);
        logger.info('Handle Text Message: %s %s', JSON.stringify(payloads), classifier);
        if (payloads.length > 0) {
          self.emit(FINISHED_HANDLE_MESSAGE_EVENT, payloads);
        }
      });
    });
  }

  findPostbackInMessageEvent(messageEvent) {
    const self = this;
    return co(function*() {
      const payloadFromWatchword = yield self.findPostbackByWatchwordsInMessageEvent(messageEvent);
      const payloadFromSynonym = yield self.findPostbackBySynonymInMessageEvent(messageEvent);

      logger.info('[Handle Text Message][Postback Found][Keywords]: By Watchword: (%s), Synonym: (%s)',
        JSON.stringify(payloadFromWatchword),
        JSON.stringify(payloadFromSynonym));

      return concat(payloadFromWatchword, payloadFromSynonym);
    });
  }

  findPostbackByWatchwordsInMessageEvent(messageEvent) {
    const self = this;
    return co(function*() {
      const watchwords = yield Watchword.findAllWatchword();

      logger.info('[Handle Text Message][Find Postback By Watchwords In Message Event][Keywords]: %s', JSON.stringify(watchwords));

      const requestedWatchwords = self.filterKeywordsInMessageEvent(messageEvent, watchwords);
      return uniq(requestedWatchwords.map(requestedWatchword => {
        return requestedWatchword.Postbacks.value;
      }));
    });
  }

  findPostbackBySynonymInMessageEvent(messageEvent) {
    const self = this;

    return co(function*() {
      const synonyms = yield Synonym.findAllWatchwordSynonyms();

      logger.info('[Handle Text Message][Find Postback By Synonyms In Message Event][Keywords]: %s', JSON.stringify(synonyms));
      const requestedKeywordSynonyms = self.filterKeywordsInMessageEvent(messageEvent, synonyms);

      return uniq(requestedKeywordSynonyms.map(requestedKeywordSynonym => {
        return requestedKeywordSynonym.Watchwords.Postbacks.value;
      }));
    });
  }

  filterKeywordsInMessageEvent(messageEvent, keywords) {
    const messageText = messageEvent.message.text;

    const requestedKeyword = keywords.filter(keyword => {
      return messageText.indexOf(keyword.value) !== -1;
    });

    return requestedKeyword;
  }
}
