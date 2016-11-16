import services from 'services';
import messages from './messages';
import ValidateListener from 'observers/base/validate-listener';
import { getUserProfile } from 'utils/service-utils';
import { User } from 'models';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';
import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';

export default class GetStartedListener extends ValidateListener {
  _shouldHandle(messageEvent) {
    return !!(messageEvent && messageEvent.postback && messageEvent.postback.payload === FACEBOOK_GET_STARTED_PAYLOAD);
  }

  _handle(messageEvent) {
    if (messageEvent && messageEvent.sender && messageEvent.sender.id) {
      const userId = messageEvent.sender.id;

      return this._saveUserProfileToDatabase(userId).then(() => {
        return this._sendResponseMessage(userId);
      });
    }
  }

  _saveUserProfileToDatabase(userId) {
    return getUserProfile(userId).then(userProfile => {
      return User.saveProfileForUser(userId, userProfile);
    });
  };

  _sendResponseMessage(userId) {
    const recipientId = userId;
    const message = this._buildResponseMessage();

    logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
    return services.sendTextMessage(recipientId, message);
  };

  _buildResponseMessage() {
    return getRandomObjectFromArray(messages);
  };
}
