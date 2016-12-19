import EventEmitter from 'events';

import { isValidSender, isEchoMessage } from 'utils/message-utils';
import { FINISHED_HANDLE_MESSAGE_EVENT,
  CLASSIFY_MESSAGE_EVENT,
  RECEIVED_MESSAGE_EVENT,
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE,
  SHIPPING_MESSAGE_EVENT,
  FINISHED_SHIPPING_MESSAGE_EVENT,
  ANALYSE_REQUESTING_PAYLOADS } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class Dispatcher extends EventEmitter {
  constructor(messageClassifier, messageProducer, messageShipper, messageReferee) {
    super();
    this.messageClassifier = messageClassifier;
    this.messageProducer = messageProducer;
    this.messageShipper = messageShipper;
    this.messageReferee = messageReferee;

    this._listenIncomingMessageEvent();
    this._listenMessageProducerEvent();
    this._listenMessageShipperEvent();
  }

  _listenIncomingMessageEvent() {
    this.on(RECEIVED_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Dispatcher: RECEIVED_MESSAGE_EVENT: (%s)', JSON.stringify(messageEvent));

      if (isValidSender(messageEvent) && !isEchoMessage(messageEvent)) {
        this.messageClassifier.emit(CLASSIFY_MESSAGE_EVENT, messageEvent);
      }
    });
  }

  _listenMessageProducerEvent() {
    this.messageClassifier.on(FINISHED_HANDLE_MESSAGE_EVENT, (senderId, payloads) => {
      logger.info('Dispatcher: FINISHED_HANDLE_MESSAGE_EVENT: (%s)', JSON.stringify(payloads));
      this.messageReferee.emit(ANALYSE_REQUESTING_PAYLOADS, senderId, payloads);
    });

    this.messageReferee.on(BUILD_MESSAGE_EVENT, (senderId, payloads) => {
      this.messageProducer.emit(BUILD_MESSAGE_EVENT, senderId, payloads);
    });
  }

  _listenMessageShipperEvent() {
    this.messageProducer.on(FINISHED_BUILD_MESSAGE, messageStructure => {
      logger.info('Dispatcher: FINISHED_BUILD_MESSAGE: (%s)', JSON.stringify(messageStructure));
      this.messageShipper.emit(SHIPPING_MESSAGE_EVENT, messageStructure);
    });

    this.messageShipper.on(FINISHED_SHIPPING_MESSAGE_EVENT, messageStructure => {
      logger.info('Dispatcher: FINISHED_SHIPPING_MESSAGE_EVENT: (%s)', JSON.stringify(messageStructure));
      logger.info('Dispatcher: FINISHED_SHIPPING_MESSAGE_EVENT:  ------------------------');
    });
  }
}

