import EventEmitter from 'events';

import MessageDispatcher from './dispatcher';
import MessageProducer from './producer';

import { isValidSender } from 'utils/message-utils';
import { DISPATCH_MESSAGE_EVENT, RECEIVED_MESSAGE_EVENT, BUILD_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class Dispatcher extends EventEmitter {
  constructor() {
    super();
    const dispatcher = this;
    this.messageProducer = new MessageProducer(dispatcher);
    this.messageDispatcher = new MessageDispatcher(dispatcher);

    this.on(RECEIVED_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Dispatcher: Received Message Event: (%s)', JSON.stringify(messageEvent));

      if (isValidSender(messageEvent)) {
        this.messageDispatcher.emit(DISPATCH_MESSAGE_EVENT, messageEvent);
      }
    });

    this.on(BUILD_MESSAGE_EVENT, payloads => {
      this.messageProducer.emit(BUILD_MESSAGE_EVENT, payloads);
    });
  }
}

