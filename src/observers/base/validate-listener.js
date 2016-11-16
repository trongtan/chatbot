import { logger } from 'logs/winston-logger';

export default class ValidateListener {
  perform(messageEvent) {
    if (this._shouldHandle(messageEvent)) {
      this._handle(messageEvent).catch(exception => {
        logger.log('error', 'Get %s on handling %j', exception, messageEvent);
      });
    }
  }

  _shouldHandle(messageEvent) {
    return false;
  }

  _handle(messageEvent) {
  }
}
