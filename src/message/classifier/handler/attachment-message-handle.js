import EventEmitter from 'events';

import { HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class AttachmentMessageHandler extends EventEmitter {
  constructor() {
    super();
    this.on(HANDLE_MESSAGE_EVENT, messageEvent => {
      logger.info('Handle Attachment Message: %s', JSON.stringify(messageEvent))
    })
  }
}
