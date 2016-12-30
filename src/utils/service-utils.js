import rp from 'request-promise';

import { logger } from 'logs/winston-logger';

export const callSendAPI = messageData => {
  const requestData = {
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  };

  logger.log('info', 'Sending message %j to %j', requestData, messageData);

  return rp(requestData);
};

export const getUserProfile = userId => {
  const requestData = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.6/${userId}`,
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
      fields: 'first_name,last_name,locale,timezone,gender'
    }
  };

  logger.log('info', 'Getting user profile of %s', JSON.stringify(requestData));

  return rp(requestData);
};

export const updatePersistentMenu = persistentMenus => {
  const requestData = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
    },
    json: {
      setting_type: 'call_to_actions',
      thread_state: 'existing_thread',
      call_to_actions: persistentMenus
    }
  };

  return rp(requestData);
};
