import EventEmitter from 'events';

import { isValidSender } from 'utils/message-utils';
import { FINISHED_HANDLE_MESSAGE_EVENT, CLASSIFY_MESSAGE_EVENT, RECEIVED_MESSAGE_EVENT, BUILD_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class Dispatcher extends EventEmitter {
  constructor(messageClassifier, messageProducer) {
    super();
    this.messageClassifier = messageClassifier;
    this.messageProducer = messageProducer;

    this._listenIncomingMessageEvent();
    this._emitEventToMessageProducer();
  }

  _listenIncomingMessageEvent() {
    this.on(RECEIVED_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Dispatcher: RECEIVED_MESSAGE_EVENT: (%s)', JSON.stringify(messageEvent));

      if (isValidSender(messageEvent)) {
        this.messageClassifier.emit(CLASSIFY_MESSAGE_EVENT, messageEvent);
      }
    });
  }

  _emitEventToMessageProducer() {
    this.messageClassifier.on(FINISHED_HANDLE_MESSAGE_EVENT, payloads => {
      logger.info('Dispatcher: FINISHED_HANDLE_MESSAGE_EVENT: (%s)', JSON.stringify(payloads));
      this.messageProducer.emit(BUILD_MESSAGE_EVENT, payloads);
    });
  }
}

