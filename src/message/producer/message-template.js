import Promise from 'promise';

import { User } from 'models';
import {
  ASSIGN_SENDER_ID_TO_MESSAGE,
  BUILD_TEXT_MESSAGE,
  BUILD_GENERIC_MESSAGE,
  BUILD_BUTTON_TEMPLATE_MESSAGE,
  BUILD_DISEASE_TEMPLATE_MESSAGE,
  FINISHED_BUILD_MESSAGE
} from 'utils/event-constants';

import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

export default class MessageTemplate {
  buildTextCardMessage(user, textCards) {
    logger.info('[MessageTemplate][BuildTextCardMessage] (%s)', JSON.stringify(user));

    let result = [];

    textCards.forEach(textCard => {
      let builtMessage;
      if (textCard.Buttons && textCard.Buttons.length > 0) {
        builtMessage = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: textCard.text,
              buttons: this._buildButtonMessage(textCard.Buttons)
            }
          },
          order: textCard.order
        };
      } else {
        builtMessage = {
          text: textCard.text,
          order: textCard.order
        };
      }

      builtMessage = this._assignSenderIdAndPlaceHolderMessage(user, builtMessage);
      result.push(builtMessage);
    });

    logger.info('[MessageTemplate][BuildTextCardMessage] (%s)', JSON.stringify(result));
    return result;
  }

  buildGalleryMessage(user, galleries) {
    logger.info('[MessageTemplate][BuildGalleryMessage] (%s)', JSON.stringify(galleries));
    let result = [];
    galleries.forEach(gallery => {
      const builtMessage = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: this._buildElement(gallery.Elements),
          },
        },
        order: gallery.order
      };

      result.push(this._assignSenderIdAndPlaceHolderMessage(user, builtMessage));
    });

    return result;
  }

  buildImageMessage(user, images) {
    logger.info('[MessageTemplate][BuildImageMessage] (%s)', JSON.stringify(images));
    let result = [];
    images.forEach(image => {
      let builtMessage = {
        attachment: {
          type: 'image',
          payload: {
            url: image.imageURL
          }
        },
        order: image.order
      };

      builtMessage = this._assignSenderIdAndPlaceHolderMessage(user, builtMessage);
      result.push(builtMessage);
    });
    return result;
  }

  _buildElement(elements) {
    let builtElements = [];

    elements.forEach(element => {
      builtElements.push({
        title: element.heading,
        image_url: element.imageURL,
        subtitle: element.subtitle,
        buttons: this._buildButtonMessage(element.Buttons)
      })
    });

    return builtElements;
  }

  buildQuickReplyMessage() {

  }

  _buildButtonMessage(buttons) {
    let builtButtons = [];
    if (buttons) {
      buttons.forEach(button => {
        if (button.Block) {
          builtButtons.push({
            type: 'postback',
            title: button.name,
            payload: 'blockId=' + button.Block.id
          });
        } else if (button.URL && button.URL.length > 0) {
          builtButtons.push({
            type: 'web_url',
            url: button.URL,
            title: button.name
          });
        } else {
          builtButtons.push({
            type: 'element_share'
          });
        }
      });
    }
    return (builtButtons.length > 0 ? builtButtons : null);
  }

  buildTextMessage(user, templateMessages) {
    const templateMessage = templateMessages[0];
    let builtMessage = {};

    if (templateMessage.Messages && templateMessage.Messages.length > 0) {
      builtMessage = {
        text: getRandomObjectFromArray(templateMessage.Messages).message
      };
    }
    if (templateMessage.QuickReplies && templateMessage.QuickReplies.length > 0) {
      builtMessage['quick_replies'] = this._buildQuickReplies(templateMessage.QuickReplies);
    }

    return Promise.resolve(this.emit(ASSIGN_SENDER_ID_TO_MESSAGE, user, builtMessage));
  }

  buildGenericTemplateMessage(user, elements) {
    const builtMessage = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: this._buildElement(elements),
        }
      }
    };

    return this.emit(ASSIGN_SENDER_ID_TO_MESSAGE, user, builtMessage);
  }

  buildButtonTemplateMessage(user, buttonTemplates) {
    const buttonTemplate = buttonTemplates[0];

    const builtMessage = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: getRandomObjectFromArray(buttonTemplate.Messages).message,
          buttons: this._buildButtons(buttonTemplate.Buttons)
        }
      }
    };

    return this.emit(ASSIGN_SENDER_ID_TO_MESSAGE, user, builtMessage);
  }

  buildDiseaseTemplateMessage(user, diseaseMessages) {
    const diseaseMessage = diseaseMessages[0];

    const builtMessage = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: this._buildArticles(diseaseMessage.Articles),
        }
      }
    };
    console.log(JSON.stringify(builtMessage));
    return Promise.resolve(this.emit(ASSIGN_SENDER_ID_TO_MESSAGE, user, builtMessage));
  }

  _assignSenderIdAndPlaceHolderMessage(user, builtMessage) {
    //FIXME: Duplicate logic here
    let message = builtMessage;
    let text = '';
    const isTextMessage = message.text;
    const isButtonTemplateMessage = message.attachment && message.attachment.payload && message.attachment.payload.text;

    if (isTextMessage) {
      text = message.text;
    } else if (isButtonTemplateMessage) {
      text = message.attachment.payload.text;
    }

    text = this._bindPlaceHolderToTemplateMessage(text, user);

    logger.info('[MessageTemplate][Bind Place Holder To Template Message][Bound Message] (%s)', text);

    if (isTextMessage) {
      message.text = text;
    } else if (isButtonTemplateMessage) {
      message.attachment.payload.text = text;
    }

    const order = message.order;
    delete message.order;

    const messages = {
      recipient: {
        id: user.userId
      },
      message: message,
      order: order
    };


    logger.error('[Message Template][Bind Place Holder To Template Message] (%s)', messages);

    return messages;

  }

  _buildQuickReplies(quickRelies) {
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

  _buildArticles(articles) {
    let builtArticles = [];

    articles.forEach(article => {
      builtArticles.push({
        title: article.title,
        image_url: article.imageURL,
        subtitle: article.subtitle,
        buttons: [
          {
            url: article.itemURL,
            type: 'web_url',
            webview_height_ratio: 'tall',
            title: 'Xem bài viết'
          },
          {
            type: 'element_share'
          }
        ]
      })
    });

    return builtArticles;
  }

  _buildButtons(buttons) {
    let builtButtons = [];
    if (buttons) {
      buttons.forEach(button => {
        switch (button.ButtonTypes.value) {
          case 'postback':
            builtButtons.push({
              type: 'postback',
              title: button.title,
              payload: button.Postback.value
            });
            break;
          case 'web_url':
            builtButtons.push({
              type: 'web_url',
              url: button.url,
              title: button.title
            });
            break;
          case 'element_share':
            builtButtons.push({
              type: 'element_share'
            });
            break;
        }
      });
    }

    return builtButtons;
  }

  _bindPlaceHolderToTemplateMessage(templateMessage, user) {
    logger.info('[MessageTemplate][Bind Place Holder To Template Message] (%j)', JSON.stringify(user));

    if (!templateMessage) return ('');

    const { firstName, lastName } = user;

    let message = templateMessage.replace(/\{\{userName}}/g, `${firstName} ${lastName}`);

    if (user.OpenedCards.length > 0) {
      const { cardName } = user.OpenedCards[0];
      logger.info('[MessageTemplate][Bind Opened Card] (%s)', JSON.stringify(user.OpenedCards[0]));

      message = message.replace(/\{\{cardName}}/g, `${cardName}`);
    }

    return message;
  }
}
