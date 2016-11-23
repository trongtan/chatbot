import Promise from 'promise';

import BaseListener from './base-listener';
import { logger } from 'logs/winston-logger';

export default class ValidateListener extends BaseListener {
  perform(messageEvent) {
    logger.info('%s Perform %s', this.tag, JSON.stringify(messageEvent));
    if (this._shouldHandle(messageEvent)) {
      return this._handle(messageEvent).then((response, error) => {
        return Promise.resolve({ handled: !error });
      });
    }
  }

  _shouldHandle(messageEvent) {
    return false;
  }

  _handle(messageEvent) {
  }
}
