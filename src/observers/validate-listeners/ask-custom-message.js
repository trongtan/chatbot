import Promise from 'promise';
import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import { logger } from 'logs/winston-logger';
import { Keyword } from 'models';

export default class AskCustomListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Custom Message]';
  }

  _isIntentionalMessage(message) {
    return Promise.resolve(true);
  }

  _getOutputPayload() {
    const self = this;
    return co(function*() {
      const payload = yield Keyword.findGroupNameByKeyword(self.messageText);
      logger.info('%s Get Output Payload For Message:(%s), payload: (%s)', self.tag, self.messageText, payload);
      return payload;
    });
  }
}
