import rp from 'request-promise';

import { logger } from 'logs/winston-logger';

export const trackMessage = (message, recipient, timestamp) => {
  // const requestData = {
  //   url: 'https://botanalytics.co/api/v1/messages/facebook-messenger',
  //   body: JSON.stringify({
  //     message: message,
  //     recipient: recipient,
  //     timestamp: timestamp
  //   }),
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': process.env.BOT_ANALYTICS_ACCESS_TOKEN
  //   }
  // };
  //
  // logger.info('[Bot Analytics][Track Message] (%j)', JSON.stringify(message));
  //
  // return rp(requestData).then(response => {
  //   logger.info('[Bot Analytics][Success] (%j)', response);
  // }).catch(error => {
  //   logger.error('[Bot Analytics][Error] %j', error);
  // });
};

export const trackOutgoingMessage = (messageStructure) => {
  return trackMessage(messageStructure.message, messageStructure.recipient.id, new Date().getTime());
};

export const trackUserProfile = (first_name, last_name, gender, user_id) => {
  //FIXME: we're temporary ignore profile_pic, locale, timezone
  // const requestData = {
  //   url: 'https://botanalytics.co/api/v1/facebook-messenger/users/',
  //   body: JSON.stringify(
  //     {
  //       first_name: first_name,
  //       last_name: last_name,
  //       gender: gender,
  //       user_id: user_id,
  //       profile_pic: '',
  //       locale:'',
  //       timezone:''
  //     }),
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': process.env.BOT_ANALYTICS_ACCESS_TOKEN
  //   }
  // };
  //
  // logger.info('[Bot Analytics][Track Message] (%j)', JSON.stringify(requestData));
  //
  // return rp(requestData).then(response => {
  //   logger.info('[Bot Analytics][Success] (%j)', response);
  // }).catch(error => {
  //   logger.error('[Bot Analytics][Error UserProfile] %j', error);
  // });
};
