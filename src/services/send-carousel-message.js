import { chunk } from 'lodash';

import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';
import { DEFAULT_MAXIMUM_PAYLOAD_ELEMENT } from 'utils/constants';

export const sendCarouselMessage = (recipientId, elements) => {
  logger.info('Send Carousel Message (%s, %s)', recipientId, JSON.stringify(elements));

  let elementsData = [];
  for (let element of elements) {
    if (element) {
      elementsData.push({
        title: element.title,
        subtitle: element.subtitle,
        item_url: element.link,
        image_url: element.image,
        buttons: element.buttons
      });
    }
  }

  chunk(elementsData, DEFAULT_MAXIMUM_PAYLOAD_ELEMENT).forEach(data => {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: data
          }
        }
      }
    };

    // FIXME handle if have more than DEFAULT_MAXIMUM_PAYLOAD_ELEMENT elements
    return callSendAPI(messageData);
  });
};
