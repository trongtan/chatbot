import services from 'services';
import messages from './messages';
import ValidateObserver from 'observers/base/validate-listener';
import { getUserProfile } from 'utils/service-utils';
import { User } from 'models';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';
import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';

export default class GetStartedListener extends ValidateObserver {
  _shouldHandle(messageEvent) {
    return messageEvent && messageEvent.postback && messageEvent.postback.payload === FACEBOOK_GET_STARTED_PAYLOAD;
  }

  _handle(messageEvent) {
    if (messageEvent.sender && messageEvent.sender.id) {
      const userId = messageEvent.sender.id;

      this._saveUserProfileToDatabase(userId).done(() => {
        this._sendResponseMessage(userId);
      });
    }
  }

  _saveUserProfileToDatabase(userId) {
    if (userId) {
      return getUserProfile(userId).then(userProfile => {
        User.saveProfileForUser(userId, userProfile);
      });
    } else {
      logger.info('Called get user profile of invalid userId');
      return Promise.reject(new Error('Called get user profile of invalid userId'));
    }
  };

  _sendResponseMessage(userId) {
    const recipientId = userId;
    const message = this._buildResponseMessage();

    logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
    services.sendTextMessage(recipientId, message);
  };

  _buildResponseMessage() {
    return getRandomObjectFromArray(messages);
  };
}
