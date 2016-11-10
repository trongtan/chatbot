import request from 'request';
import Promise from 'promise';

import { logger } from 'logs/winston-logger';

export const callSendAPI = function (messageData) {
  const requestData = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  };

  logger.log('info', 'Sending message %j to %j', requestData, messageData);

  request(requestData, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var recipientId = body['recipient_id'];
      var messageId = body['message_id'];

      if (messageId) {
        logger.log('info', 'Successfully sent message to recipient %s', recipientId);
      } else {
        logger.log('info', 'Successfully called Send API for recipient %s', recipientId);
      }
    } else {
      logger.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
    }
  });
};

export const getUserProfile = function (userId) {
  return new Promise((fulfill, reject) => {
    const requestData = {
      method: 'GET',
      uri: `https://graph.facebook.com/v2.6/${userId}`,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: 'first_name,last_name,locale,timezone,gender'
      }
    };

    logger.log('info', 'Getting user profile of %s', userId);

    request(requestData, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        logger.log('info', 'Get user profile %j', body);

        return fulfill(body);
      } else {
        logger.error('Failed getting user profile', response.statusCode, response.statusMessage, body.error);
        return reject(error);
      }
    });
  });
};
