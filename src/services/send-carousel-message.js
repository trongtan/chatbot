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

  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: chunk(elementsData, DEFAULT_MAXIMUM_PAYLOAD_ELEMENT)[0]
        }
      }
    }
  };

  // FIXME handle if have more than DEFAULT_MAXIMUM_PAYLOAD_ELEMENT elements
  return callSendAPI(messageData);
};
