import EventEmitter from 'events';

import { HANDLE_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class QuickReplyMessageHandler extends EventEmitter {
  constructor() {
    super();
    this.on(HANDLE_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Handle Quick Reply Message: %s', JSON.stringify(messageEvent))
      const payload = messageEvent.message.quick_reply.payload;
      const senderId = messageEvent.sender.id;

      this.emit(FINISHED_HANDLE_MESSAGE_EVENT, senderId, payload.split('-'));
    })
  }
}
