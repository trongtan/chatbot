import co from 'co';
import Promise from 'promise';

import ValidateListener from 'observers/base/validate-listener';
import { isIntentionalPostback, isTextVisible, isSenderValid } from 'utils/FBMessageValidator';
import { Keyword } from 'models';
import { payloadConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export default class GreetingListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Greeting]';
  }

  _shouldHandle(messageEvent) {
    logger.log('%s Should Handle %s', this.tag, JSON.stringify(messageEvent));

    if (messageEvent) {
      if (isIntentionalPostback(messageEvent, payloadConstants.GREETING_PAYLOAD)) {
        return Promise.resolve(true);
      } else if (isTextVisible(messageEvent)) {
        return this._validateTextMessage(messageEvent.message.text);
      }
    }

    return Promise.resolve(false);
  }

  _handle(messageEvent) {
    if (isSenderValid(messageEvent)) {
      const userId = messageEvent.sender.id;

      return this._sendResponseMessage({ user: { userId: userId }, payload: payloadConstants.GREETING_PAYLOAD });
    } else {
      logger.info('%s Not handle (%s)', this.tag, JSON.stringify(messageEvent));
      return Promise.reject(`${this.tag} Not handle (%s)`);
    }
  }

  _validateTextMessage(message) {
    return co(function*() {
      const greetingKeywords = yield Keyword.findAllGreeting();

      for (let keyword of greetingKeywords) {
        if (message.includes(keyword)) {
          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    });
  }
}
