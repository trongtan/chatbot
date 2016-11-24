import Promise from 'promise';
import co from 'co';

import { User } from 'models';
import BaseListener from './base-listener';
import { isIntentionalPostback, isTextVisible, isSenderValid } from 'utils/FBMessageValidator';
import { logger } from 'logs/winston-logger';

export default class ValidateListener extends BaseListener {
  constructor() {
    super();
    this.intentionalPostbackPayload = '';
    this.messagePayload = '';
  }

  perform(messageEvent) {
    if (isSenderValid(messageEvent)) {
      logger.info('%s Perform %s', this.tag, JSON.stringify(messageEvent));

      const self = this;
      return co(function*() {
        const shouldHandle = yield self._shouldHandle(messageEvent);

        if (shouldHandle) {
          return self._handle(messageEvent).then((response, error) => {
            return Promise.resolve({ handled: !error });
          });
        } else {
          return Promise.resolve({ handled: false })
        }
      });
    }

    return Promise.resolve({ handled: false })
  }

  _shouldHandle(messageEvent) {
    logger.info('%s ? Should Handle %s', this.tag, JSON.stringify(messageEvent));

    if (isIntentionalPostback(messageEvent, this.intentionalPostbackPayload)) {
      return Promise.resolve(true);
    }

    if (isTextVisible(messageEvent)) {
      return this._isIntentionalMessage(messageEvent.message.text);
    }

    return Promise.resolve(false);
  }

  _handle(messageEvent) {
    logger.info('%s Handle (%s)', this.tag, JSON.stringify(messageEvent));

    const self = this;
    const userId = messageEvent.sender.id;
    return co(function*() {
      const user = yield User.findOrCreateById(userId);
      const payload = self.messagePayload ? self.messagePayload : self.intentionalPostbackPayload;
      return yield self._sendResponseMessage({ user: user, payload: payload });
    });
  }

  _isIntentionalMessage(message) {
    logger.info('%s ? Is Intentional Message %s', this.tag, JSON.stringify(message));

    return this._getIntentionalKeywords().then(keywords => {
      for (let keyword of keywords) {
        if (message.includes(keyword)) {
          return true;
        }
      }

      return false;
    });
  }

  _getIntentionalKeywords() {
    return Promise.resolve([]);
  }
}
