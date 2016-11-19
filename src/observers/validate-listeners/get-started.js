import Promise from 'promise';

import ValidateListener from 'observers/base/validate-listener';
import { getUserProfile } from 'utils/service-utils';
import { User } from 'models';
import { logger } from 'logs/winston-logger';
import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';
import { payloadConstants } from 'utils/constants';

export default class GetStartedListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Get started]';
  }

  _shouldHandle(messageEvent) {
    return !!(messageEvent && messageEvent.postback && messageEvent.postback.payload === FACEBOOK_GET_STARTED_PAYLOAD);
  }

  _handle(messageEvent) {
    if (messageEvent && messageEvent.sender && messageEvent.sender.id) {
      const userId = messageEvent.sender.id;

      return User.findOrCreateById(userId).then((user) => {
        console.log('userrr', user);
        return this._sendResponseMessage({ user: user, payload: payloadConstants.GET_STARTED_PAYLOAD });
      });
    }
  }
}
