import Promise from 'promise';
import co from 'co';

import { User } from 'models';
import BaseListener from './base-listener';
import { isIntentionalPostback, isIntentionalQuickReply, isTextVisible, isSenderValid } from 'utils/FBMessageValidator';
import { logger } from 'logs/winston-logger';

export default class ValidateListener extends BaseListener {
  constructor() {
    super();
    this.intentionalPayload = '';
    this.messagePayload = '';
    this.originPayload = '';
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

    if (isIntentionalPostback(messageEvent, this.intentionalPayload)) {
      this.originPayload = messageEvent.postback.payload;
      return Promise.resolve(true);
    }

    if (isIntentionalQuickReply(messageEvent, this.intentionalPayload)) {
      this.originPayload = messageEvent.message.quick_reply.payload;
      return Promise.resolve(true);
    }

    if (isTextVisible(messageEvent)) {
      this.messageText = messageEvent.message.text;
      return this._isIntentionalMessage(this.messageText);
    }

    return Promise.resolve(false);
  }

  _handle(messageEvent) {
    logger.info('%s Handle (%s)', this.tag, JSON.stringify(messageEvent));

    const self = this;
    const userId = messageEvent.sender.id;
    return co(function*() {
      const user = yield User.findOrCreateById(userId);
      const payload = yield self._getOutputPayload();
      return yield self._sendResponseMessage({ user: user, payload: payload });
    });
  }

  _isIntentionalMessage(message) {
    const self = this;

    return co(function*() {
      const keywords = yield self._getIntentionalKeywords();

      logger.info('%s ? Is Intentional Message %s %s', self.tag, JSON.stringify(message), JSON.stringify(keywords));

      for (let keyword of keywords) {
        if (message.toLowerCase().includes(keyword)) {
          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    });
  }

  _getIntentionalKeywords() {
    return Promise.resolve([]);
  }

  _getOutputPayload() {
    if (this.messagePayload) return Promise.resolve(this.messagePayload);
    if (this.originPayload) return Promise.resolve(this.originPayload);
    return Promise.resolve(this.intentionalPayload);
  }
}
