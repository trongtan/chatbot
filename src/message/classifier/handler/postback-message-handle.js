import EventEmitter from 'events';

import { HANDLE_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class PostbackMessageHandler extends EventEmitter {
  constructor() {
    super();
    this.on(HANDLE_MESSAGE_EVENT, (classifier, messageEvent) => {
      logger.info('Handle Postback Message: %s', JSON.stringify(messageEvent));
      const payload = messageEvent.postback.payload;

      classifier.emit(FINISHED_HANDLE_MESSAGE_EVENT, [payload]);
    })
  }
}

