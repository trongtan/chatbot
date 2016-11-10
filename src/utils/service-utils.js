import request from 'request';

import { logger } from 'logs/winston-logger';

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
export const callSendAPI = function (messageData) {
  const requestData = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  };

  logger.log('info', 'Sending message %j to %j', requestData, messageData);

  request(requestData, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body['recipient_id'];
      var messageId = body['message_id'];

      if (messageId) {
        logger.log('info', 'Successfully sent message with id %s to recipient %s', messageId, recipientId);
      } else {
        logger.log('info', 'Successfully called Send API for recipient %s', recipientId);
      }
    } else {
      logger.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
    }
  });
};
