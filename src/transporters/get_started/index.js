import Promise from 'promise';

import { User } from 'models';
import { getUserProfile } from 'utils/service-utils';
import { getRandomObjectFromArray } from 'utils/helpers';
import { GET_STARTED_PAYLOAD } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import messages from './messages';

export const isGetStarted = responseMessage => {
  return responseMessage && responseMessage.payload === GET_STARTED_PAYLOAD;
};

export const handleGetStartedResponseMessage = (responseMessage, services) => {
  _saveUserProfileToDatabase(responseMessage).done(() => {
    _handleGetStartedMessage(responseMessage, services);
  });
};

const _getGetStartedResponseMessage = () => {
  return getRandomObjectFromArray(messages).message;
};

const _saveUserProfileToDatabase = responseMessage => {
  const userId = responseMessage.senderId;

  if (userId) {
    return getUserProfile(userId).then(function (userProfile) {
      User.saveProfileForUser(userId, userProfile);
    });
  } else {
    logger.info('Called get user profile of invalid userId');
    return Promise.reject(new Error('Called get user profile of invalid userId'));
  }
};

const _handleGetStartedMessage = (responseMessage, services) => {
  const recipientId = responseMessage.senderId;
  const message = _getGetStartedResponseMessage();

  logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
  services.sendTextMessage(recipientId, message);
};
