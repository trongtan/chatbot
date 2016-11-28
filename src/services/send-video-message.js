import { callSendAPI } from 'utils/service-utils';
import { logger } from 'logs/winston-logger';

export const sendVideoMessage = function (recipientId, videoURL, metadata) {
  logger.info('Send Video With MetaData (%s, %s, %s)', recipientId, JSON.stringify(metadata));

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      metadata: metadata,
      attachment: {
        type: 'video',
        payload: {
          url: videoURL
        }
      }
    }
  };

  return callSendAPI(messageData);
};
