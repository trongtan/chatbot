import Promise from 'promise';
import co from 'co';

import { User } from 'models';

import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

export default class MessageTempalate {

  buildTextMessage(senderId, texts) {
    const self = this;

    return co(function *() {
      const rawMessage = getRandomObjectFromArray(texts.Messages);
      return yield self._bindPlaceHolderToTemplateMessage(rawMessage.message, senderId)
        .catch(error => {
          return Promise.reject(error);
        });
    });
  }

  buildQuickReplies(quickRelies) {
    let quickReplies = [];
    quickRelies.forEach(quickReply => {
      if (quickReply.contentType === 'text') {
        quickReplies.push({
          content_type: quickReply.contentType,
          title: quickReply.title,
          payload: quickReply.postbackId,
          image_url: quickReply.imageURL
        });
      } else {
        quickReplies.push({
          content_type: 'location',
        })
      }
    });

    return quickReplies;
  }

  buildElementMessage(senderId, elements) {
    let builtElements = [];
    elements.forEach(element => {
      builtElements.push({
        title: element.title,
        image_url: element.imageURL,
        subtitle: element.subtitle,
        default_action: {
          type: 'web_url',
          url: element.itemURL,
          messenger_extensions: true,
          webview_height_ratio: 'tall',
          fallback_url: element.itemURL
        }
      })
    });

    return {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: builtElements
          }
        }
      }
    };
  }

  _bindPlaceHolderToTemplateMessage(templateMessage, userId) {
    logger.info('Bind Place Holder To Template Message (%s), (%s)',
      JSON.stringify(templateMessage),
      JSON.stringify(userId));

    if (!templateMessage) return Promise.resolve('');
    if (!userId) return Promise.reject('UserId must be present');

    return co(function *() {
      const user = yield User.findOrCreateById(userId);
      if (user) {
        const { parental, firstName, lastName, childName } = user;
        const parentalStatus = User.getParentalName(parental);

        return templateMessage.replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${firstName} ${lastName}`)
          .replace(/\{\{childName}}/g, `${childName}`)
      }
    });
  }
}
