import EventEmitter from 'events';
import co from 'co';

import { RSSes } from 'models';

import { BUILD_RSS_MESSAGE_EVENT, FINISHED_BUILD_RSS_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageRSS extends EventEmitter {
  constructor() {
    super();
    this.on(BUILD_RSS_MESSAGE_EVENT, (user, payloads) => {
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT]: %s', payloads);

      const self = this;
      return co(function *() {
        const messageTemplate = yield self._buildRSSCategories();
        logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][Message Template]: %s', JSON.stringify(messageTemplate));
        self.emit(FINISHED_BUILD_RSS_MESSAGE_EVENT, user, messageTemplate);
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
        Messages: [
          {
            // FIXME: we're temporary let fixed message her. Will refactor later.
            message: 'Chào mừng bạn đến với mục đọc tin tức của LifePedia Chatbot'
          }
        ],
        QuickReplies: quickRelies
      }];
    });
  }
}
