import Promise from 'promise';
import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants, keywordGroupConstants } from 'utils/constants';
import { isIntentionalPostback, isTextVisible, isSenderValid } from 'utils/FBMessageValidator';
import { Keyword } from 'models';
import { logger } from 'logs/winston-logger';

export default class AskGuideListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Guide Listener]';
  }

  _shouldHandle(messageEvent) {
    logger.log('%s Should Handle %s', this.tag, JSON.stringify(messageEvent));

    if (messageEvent) {
      if (isIntentionalPostback(messageEvent, payloadConstants.GUIDE_PAYLOAD)) {
        return Promise.resolve(true);
      } else if (isTextVisible(messageEvent)) {
        return this._isAskGuideMessage(messageEvent.message.text);
      }
    }

    return Promise.resolve(false);
  }

  _handle(messageEvent) {
    if (isSenderValid(messageEvent)) {
      const userId = messageEvent.sender.id;

      return this._sendResponseMessage({ user: { userId: userId }, payload: payloadConstants.GUIDE_PAYLOAD });
    } else {
      logger.info('%s Not handle (%s)', this.tag, JSON.stringify(messageEvent));
      return Promise.reject(`${this.tag} Not handle (%s)`);
    }
  }

  _isAskGuideMessage(message) {
    return co(function*() {
      const guideKeywords = yield Keyword.findKeyWordsByGroup(keywordGroupConstants.GUIDE);

      for (let keyword of guideKeywords) {
        if (message.includes(keyword)) {
          return Promise.resolve(true);
        }
      }

      return Promise.resolve(false);
    });
  }
}
