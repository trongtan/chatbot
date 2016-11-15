import { callSendAPI } from 'utils/service-utils';

export const sendCarouselMessage = (recipientId, elements) => {
  let elementsData = [];
  for (let element of elements) {
    const elementData = {
      // TODO: we're waiting for the data from client. Fix it later.
      title: 'The standard Lorem Ipsum passage, used since the 1500s',
      item_url: element,
      // TODO: we're waiting for the data from client. Fix it later.
      image_url: 'https://cdn.vectorstock.com/i/composite/39,73/beautiful-doctor-vector-323973.jpg',
      // TODO: we're waiting for the data from client. Fix it later.
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      buttons: [{
        type: 'web_url',
        url: element,
        title: 'View Website'
      }]
    };
    elementsData.push(elementData);
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
          elements: elementsData
        }
      }
    }
  };

  callSendAPI(messageData);
};
