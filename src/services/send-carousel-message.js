import _ from 'lodash';

import { callSendAPI } from 'utils/service-utils';
import { DEFAULT_MAXIMUM_PAYLOAD_ELEMENT } from 'utils/constants';

export const sendCarouselMessage = (recipientId, elements) => {
  let elementsData = [];
  for (let element of elements) {
    const elementData = {
      // FIXME: fix hard code title, image_url and subtitle, we're waiting for the data from client. Fix it later.
      title: 'The standard Lorem Ipsum passage, used since the 1500s',
      item_url: element,
      image_url: 'https://cdn.vectorstock.com/i/composite/39,73/beautiful-doctor-vector-323973.jpg',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      buttons: [{
        type: 'web_url',
        url: element,
        title: 'View Website'
      }]
    };
    elementsData.push(elementData);
  }

  _.chunk(elementsData, DEFAULT_MAXIMUM_PAYLOAD_ELEMENT).forEach(data => {
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

    callSendAPI(messageData);
  });
};
