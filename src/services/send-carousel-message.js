import { chunk } from 'lodash';

import { callSendAPI } from 'utils/service-utils';
import { DEFAULT_MAXIMUM_PAYLOAD_ELEMENT } from 'utils/constants';

export const sendCarouselMessage = (recipientId, elements) => {
  let elementsData = [];
  for (let element of elements) {
    if (element && element.link) {
      elementsData.push({
        title: element.title,
        item_url: element.link,
        image_url: element.image,
        subtitle: element.subtitle,
        buttons: [{
          type: 'web_url',
          url: element.link,
          title: 'View Website'
        }]
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
