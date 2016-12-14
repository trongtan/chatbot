import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import { logger } from 'logs/winston-logger';
import { Keyword } from 'models';
import { User } from 'models';

export default class AskPostbackListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Postback Payload]';
  }

  _validatePostbackButton(messageEvent, userId) {
    logger.info('%s Validate Postback button(%s)', this.tag, JSON.stringify(messageEvent));

    return User.findOrCreateById(userId).then(user => {
      logger.info('%sValidate on user', this.tag, JSON.stringify(user));
      if (user && user.currentPayload) {
        return Promise.resolve({ shouldHandle: true, user: user, payload: messageEvent.postback.payload });
      }
    }).catch(() => {
      return Promise.resolve({ shouldHandle: false });
    });
    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    return this._sendResponseMessage(dataAnalysis);
  }
}
