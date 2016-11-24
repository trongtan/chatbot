import Promise from 'promise';
import co from 'co';

import BaseListener from './base-listener';
import { logger } from 'logs/winston-logger';

export default class ValidateListener extends BaseListener {
  perform(messageEvent) {
    logger.info('%s Perform %s', this.tag, JSON.stringify(messageEvent));

    const self = this;
    return co(function* () {
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

  _shouldHandle(messageEvent) {
    return Promise.resolve(false);
  }

  _handle(messageEvent) {
    return Promise.resolve({ handled: false })
  }
}
