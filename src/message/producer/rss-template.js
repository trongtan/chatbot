import co from 'co';

import { map } from 'lodash';
import { RSSes } from 'models';

import { DEFAULT_SEPARATOR_PAYLOAD, DEFAULT_UNSUPPORTED_PAYLOAD } from 'utils/constants';
import { SUBSCRIBE, UNSUBSCRIBE, MORE_STORY } from 'utils/constants';

import { logger } from 'logs/winston-logger';

export default class RSSTemplate {
  buildRSSCategories() {
    const quickRelies = [];

    return co(function *() {
      const rssElements = yield RSSes.findAllRSS();
      logger.info('[MessageRSS][BUILD_RSS_MESSAGE_EVENT][RssElements]: %s', JSON.stringify(rssElements));
      if (rssElements.length > 0) {
        rssElements.forEach(rss => {
          quickRelies.push({
            contentType: 'text',
            title: rss.title,
            postbackId: (rss.Postback ? rss.Postback.value : DEFAULT_UNSUPPORTED_PAYLOAD)
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

  buildRSSSubCategory(user, rss, parentPayload) {
    let isSubscribedCategory = false;
    if (user.subscribe) {
      isSubscribedCategory = user.subscribe.includes(parentPayload);
    }

    return [{
      title: rss.title,
      subtitle: rss.description,
      imageURL: rss.imageURL,
      Buttons: [
        {
          title: (isSubscribedCategory) ? 'UnSubscribe' : 'Subscribe',
          Postback: {
            value: ((isSubscribedCategory) ? UNSUBSCRIBE : SUBSCRIBE) + DEFAULT_SEPARATOR_PAYLOAD + parentPayload,
          },
          ButtonTypes: {
            value: 'postback'
          }
        },
        {
          title: 'More Stories',
          Postback: {
            value: MORE_STORY + DEFAULT_SEPARATOR_PAYLOAD + parentPayload,
          },
          ButtonTypes: {
            value: 'postback'
          }
        }]
    }];
  }

  buildMoreStory(parentPayload) {
    return {
      title: "More Stories",
      Buttons: [
        {
          title: 'More',
          Postback: {
            value: MORE_STORY + DEFAULT_SEPARATOR_PAYLOAD + parentPayload,
          },
          ButtonTypes: {
            value: 'postback'
          }
        }]
    };
  }

  buildRSSStories(rss) {
    return map(rss, element => {
      return {
        title: element.title,
        subtitle: element.description,
        imageURL: element.imageUrl ? element.imageUrl : element.url,
        Buttons: [
          {
            title: 'View on Web',
            url: element.url,
            ButtonTypes: {
              value: 'web_url'
            }
          },
          {
            ButtonTypes: {
              value: 'element_share'
            }
          }
        ]
      }
    });
  }
}
