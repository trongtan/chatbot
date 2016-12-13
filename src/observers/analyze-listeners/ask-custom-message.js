import Promise from 'promise';
import co from 'co';

import AnalyzeListener from 'observers/base/analyze-listener';
import { logger } from 'logs/winston-logger';
import { Keyword } from 'models';

export default class AskCustomListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Custom Message]';
  }

  _validateMessageAndUserState(text, user) {
    logger.info('%s Validate Message And User State (%s %s)', this.tag, text, JSON.stringify(user));
    const self = this;
    this.messageText = text;

    return co(function*() {
      const shouldHandle = yield self._messageTextMatchedWithKeyword();
      return Promise.resolve({ shouldHandle: shouldHandle, user: user});
    });
  }

  _execute(dataAnalysis) {
    const self = this;
    return co(function*() {
      dataAnalysis['payload'] = yield self._getOutputPayload();

      return self._sendResponseMessage(dataAnalysis);
    });
  }

  _messageTextMatchedWithKeyword() {
    const self = this;
    return co(function*() {
      const keyword = yield Keyword.findKeywordByName(self.messageText);
      return keyword ? Promise.resolve(true) : Promise.resolve(false);
    });
  }

  _getOutputPayload() {
    const self = this;
    return co(function*() {
      const payload = yield Keyword.findGroupNameByKeyword(self.messageText);
      logger.info('%s Get Output Payload For Message:(%s), payload: (%s)', self.tag, payload);

      return payload;
    });
  }
}
