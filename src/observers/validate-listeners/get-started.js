import Promise from 'promise';

import ValidateListener from 'observers/base/validate-listener';
import { isIntentionalPostback, isSenderValid } from 'utils/FBMessageValidator';
import { User } from 'models';
import { payloadConstants, FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export default class GetStartedListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Get started]';
  }

  _shouldHandle(messageEvent) {
    return Promise.resolve(isIntentionalPostback(messageEvent, FACEBOOK_GET_STARTED_PAYLOAD));
  }

  _handle(messageEvent) {
    logger.info('%s Handle message (%s)', this.tag, JSON.stringify(messageEvent));

    if (isSenderValid(messageEvent)) {
      const userId = messageEvent.sender.id;

      return User.findOrCreateById(userId).then(user => {
        return this._sendResponseMessage({ user: user, payload: payloadConstants.GET_STARTED_PAYLOAD });
      });
    } else {
      return Promise.reject('%s Not handle (%s)', JSON.stringify(messageEvent));
    }
  }
}
