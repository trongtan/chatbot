import Promise from 'promise';

import { logger } from 'logs/winston-logger';
import { isGetStarted, getGetStartedResponseMessage } from './get_started';
import { getUserProfile } from 'utils/service-utils';

export default class TransporterCenter {
  constructor(services) {
    this.services = services;
  }

  handle(responseMessage) {
    if (isGetStarted(responseMessage)) {
      this._saveUserProfileToDatabase(responseMessage).done(() => {
        this._handleGetStartedMessage(responseMessage);
      });
    }
  }

  _saveUserProfileToDatabase(responseMessage) {
    const userId = responseMessage.senderId;

    if (userId) {
      return getUserProfile(userId);
    } else {
      logger.log('info', 'Called get user profile of invalid userId');
      return Promise.reject(new Error('Called get user profile of invalid userId'));
    }
  }

  _handleGetStartedMessage(responseMessage) {
    const recipientId = responseMessage.senderId;
    const message = getGetStartedResponseMessage();

    logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
    this.services.sendTextMessage(recipientId, message);
  }
}
