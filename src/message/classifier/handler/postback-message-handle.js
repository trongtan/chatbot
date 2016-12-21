import EventEmitter from 'events';

import { HANDLE_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class PostbackMessageHandler extends EventEmitter {
  constructor() {
    super();
    this.on(HANDLE_MESSAGE_EVENT, (classifier, messageEvent) => {
      logger.info('[Handle Postback Message] [HANDLE_MESSAGE_EVENT]: %s', JSON.stringify(messageEvent));
      const payload = messageEvent.postback.payload;
      const senderId = messageEvent.sender.id;

      classifier.emit(FINISHED_HANDLE_MESSAGE_EVENT, senderId, payload.split('-'));
    })
  }
}

