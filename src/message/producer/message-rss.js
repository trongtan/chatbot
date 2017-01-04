import EventEmitter from 'events';
import co from 'co';
import Feed from 'vendors/feed';

import { split } from 'lodash';

import { RSSes } from 'models';

import { BUILD_RSS_MESSAGE_EVENT, FINISHED_BUILD_RSS_MESSAGE_EVENT } from 'utils/event-constants';
import { CATEGORY_TYPE, SUBCATEGORY_TYPE, DEFAULT_SEPARATOR_PAYLOAD } from 'utils/constants';

import { logger } from 'logs/winston-logger';

export default class MessageRSS extends EventEmitter {
  constructor() {
    super();
    this.on(BUILD_RSS_MESSAGE_EVENT, (user, payloads) => {
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT]: %s', payloads);

      const self = this;
      return co(function *() {
        if (payloads.includes('REQUEST_RSS_PAYLOAD')) {
          const messageTemplate = yield self._buildRSSCategories();
          logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][Message Template]: %s', JSON.stringify(messageTemplate));
          self.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, CATEGORY_TYPE, messageTemplate);
        } else {
          // Handle first payloads
          if (payloads.length > 0) {
            const firstPayload = payloads[0];
            const rss = yield RSSes.findRSSByPostback(firstPayload);
            logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS]: %s', JSON.stringify(rss));

            Feed.load(rss.rssURL, (err, rss) => {
              logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS Fetched]: %s', JSON.stringify(rss));
              if (err) {
                logger.error('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RSS Fetched Error]: %s', JSON.stringify(err));
              }

              /*** Split the payload has structure
               * 'SUBSCRIBE~LAMME_RSS_PAYLOAD'
               * 'MORE_STORY~LAMME_RSS_PAYLOAD'
               */
              const rssPayloads = split(firstPayload, DEFAULT_SEPARATOR_PAYLOAD);
              if (rssPayloads.length > 1) {

              } else {
                const subCategoryTemplateMessage = self._buildRSSSubCategory(rss, firstPayload);
                self.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, SUBCATEGORY_TYPE, subCategoryTemplateMessage);
              }
            });
          }
        }
      });
    });
  }

  _buildRSSCategories() {
    const quickRelies = [];

    return co(function *() {
      const rssElements = yield RSSes.findAllRSS();
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RssElements]: %s', JSON.stringify(rssElements));
      if (rssElements.length > 0) {
        rssElements.forEach(rss => {
          quickRelies.push({
            contentType: 'text',
            title: rss.title,
            postbackId: (rss.Postback ? rss.Postback.value : 'UNSUPPORTED_PAYLOAD')
          });
        });
      }

      return [{
        Messages: [{
          // FIXME: we're temporary let fixed message her. Will refactor later.
          message: 'Chào mừng bạn đến với mục đọc tin tức của LifePedia Chatbot'
        }],
        QuickReplies: quickRelies
      }];
    });
  }

  _buildRSSSubCategory(rss, parentPayload) {
    return [{
      title: rss.title,
      subtitle: rss.description,
      imageURL: rss.imageURL,
      Buttons: [
        {
          title: 'Subscribe',
          Postback: {
            value: 'SUBSCRIBE' + DEFAULT_SEPARATOR_PAYLOAD + parentPayload,
          },
          ButtonTypes: {
            value: 'postback'
          }
        },
        {
          title: 'More Stories',
          Postback: {
            value: 'MORE_STORY' + DEFAULT_SEPARATOR_PAYLOAD + parentPayload,
          },
          ButtonTypes: {
            value: 'postback'
          }
        }]
    }];
  }
}
