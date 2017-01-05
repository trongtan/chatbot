import EventEmitter from 'events';
import co from 'co';
import Feed from 'vendors/feed';

import { split, remove, slice } from 'lodash';

import { RSSes, User } from 'models';

import { BUILD_RSS_MESSAGE_EVENT, FINISHED_BUILD_RSS_MESSAGE_EVENT } from 'utils/event-constants';
import { CATEGORY_TYPE, SUBCATEGORY_TYPE, DEFAULT_SEPARATOR_PAYLOAD, DEFAULT_RSS_PAYLOAD, DEFAULT_UNSUPPORTED_PAYLOAD } from 'utils/constants';
import { SUBSCRIBE, UNSUBSCRIBE, MORE_STORY, DEFAULT_MAX_LOAD_MORE_ELEMENTS } from 'utils/constants';

import { logger } from 'logs/winston-logger';

export default class MessageRSS extends EventEmitter {
  constructor(rssTemplate) {
    super();
    this.rssTemplate = rssTemplate;
    this.on(BUILD_RSS_MESSAGE_EVENT, (user, payloads) => {
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT]: %s', payloads);

      if (payloads.includes(DEFAULT_RSS_PAYLOAD)) {
        this._processRequestRSSPayload(user);
      } else {
        this._handleRSSCategory(user, payloads);
      }
    });
  }

  _processRequestRSSPayload(user) {
    const self = this;
    return co(function *() {
      const messageTemplate = yield self.rssTemplate.buildRSSCategories();
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][Message Template]: %s', JSON.stringify(messageTemplate));
      self.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, CATEGORY_TYPE, messageTemplate);
    });
  }

  _handleRSSCategory(user, payloads) {
    const self = this;
    return co(function *() {
      if (payloads.length > 0) {
        const firstPayload = payloads[0];
        /*** Split the payload has structure
         * 'SUBSCRIBE~LAMME_RSS_PAYLOAD'
         * 'UNSUBSCRIBE~LAMME_RSS_PAYLOAD'
         * 'MORE_STORY~LAMME_RSS_PAYLOAD'
         */
        const rssPayloads = split(firstPayload, DEFAULT_SEPARATOR_PAYLOAD);
        const parsedRSSPayload = self._parseRSSPayload(rssPayloads);
        const rss = yield RSSes.findRSSByPostback(parsedRSSPayload.category);
        logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS]: %s', JSON.stringify(rss));

        Feed.load(rss.rssURL, (err, rss) => {
          logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS Fetched]: %s', JSON.stringify(rss));
          if (err) {
            logger.error('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS Fetched Error]: %s', JSON.stringify(err));
            return;
          }

          logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][rssPayloads]: %s', JSON.stringify(rssPayloads));
          if (parsedRSSPayload.action) {
            self._handleUserActionOnRSSSubCategory(user, rss, parsedRSSPayload);
          } else {
            self._handleUserSelectRSSCategory(user, rss, parsedRSSPayload);
          }
        });
      }
    });
  }

  _parseRSSPayload(rssPayloads) {
    let rssCategory;
    let rssAction;

    if (rssPayloads.length > 1) {
      rssAction = rssPayloads[0];
      rssCategory = rssPayloads[1];
    } else {
      rssCategory = rssPayloads[0];
    }
    return {
      action: rssAction,
      category: rssCategory
    }
  }

  _handleUserActionOnRSSSubCategory(user, rss, parsedPayload) {
    switch (parsedPayload.action) {
      case SUBSCRIBE:
        if (!user.subscribe) {
          user.subscribe = [];
        }

        user.subscribe.push(parsedPayload.category);
        User.updateSubscribe(user.userId, user.subscribe);
        break;
      case UNSUBSCRIBE:
        remove(user.subscribe, (category) => {
          return category === parsedPayload.category;
        });
        User.updateSubscribe(user.userId, user.subscribe);

        break;
      case MORE_STORY:
        const readingIndex = user.readStories;

        let allStories = this.rssTemplate.buildRSSStories(rss.items);

        const min = Math.min(allStories.length, readingIndex + DEFAULT_MAX_LOAD_MORE_ELEMENTS);
        let stories = slice(allStories, readingIndex, min);
        if (readingIndex + DEFAULT_MAX_LOAD_MORE_ELEMENTS < allStories.length) {
          let lastItem = this.rssTemplate.buildMoreStory(parsedPayload.category);
          stories.push(lastItem);
          User.updateReadStories(user.userId, readingIndex + DEFAULT_MAX_LOAD_MORE_ELEMENTS);
        } else { User.updateReadStories(user.userId, 0); }

        this.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, SUBCATEGORY_TYPE, stories);
        break;
    }
  }

  _handleUserSelectRSSCategory(user, rss, parsedRSSPayload) {
    const subCategoryTemplateMessage = this.rssTemplate.buildRSSSubCategory(user, rss, parsedRSSPayload.category);
    this.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, SUBCATEGORY_TYPE, subCategoryTemplateMessage);
  }
}
