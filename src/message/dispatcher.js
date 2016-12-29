import co from 'co';
import EventEmitter from 'events';

import { isValidSender, isEchoMessage, isDeliveryMessage, isReadMessage } from 'utils/message-utils';
import {
  FINISHED_HANDLE_MESSAGE_EVENT,
  CLASSIFY_MESSAGE_EVENT,
  RECEIVED_MESSAGE_EVENT,
  BUILD_MESSAGE_EVENT,
  FINISHED_BUILD_MESSAGE,
  SHIPPING_MESSAGE_EVENT,
  FINISHED_SHIPPING_MESSAGE_EVENT,
  BUILD_CONVERSATION_MESSAGE
} from 'utils/event-constants';

import {
  TRACK_INCOMING_MESSAGE_EVENT,
  TRACK_OUT_GOING_MESSAGE_EVENT
} from 'utils/event-constants';

import { User } from 'models';

import { logger } from 'logs/winston-logger';

export default class Dispatcher extends EventEmitter {
  constructor(messageClassifier, messageProducer, messageShipper, messageTracker, conversationProducer) {
    super();
    this.messageClassifier = messageClassifier;
    this.messageProducer = messageProducer;
    this.messageShipper = messageShipper;
    this.messageTracker = messageTracker;
    this.conversationProducer = conversationProducer;

    this._listenIncomingMessageEvent();
    this._listenMessageProducerEvent();
    this._listenMessageShipperEvent();
  }

  _listenIncomingMessageEvent() {
    this.on(RECEIVED_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Dispatcher: RECEIVED_MESSAGE_EVENT: (%s)', JSON.stringify(messageEvent));

      if (isValidSender(messageEvent) && !isEchoMessage(messageEvent) && !isDeliveryMessage(messageEvent) && !isReadMessage(messageEvent)) {
        this.messageClassifier.emit(CLASSIFY_MESSAGE_EVENT, messageEvent);
        this.messageTracker.emit(TRACK_INCOMING_MESSAGE_EVENT, messageEvent);
      }
    });
  }

  _listenMessageProducerEvent() {
    this.messageClassifier.on(FINISHED_HANDLE_MESSAGE_EVENT, (senderId, payloads) => {
      logger.info('Dispatcher: FINISHED_HANDLE_MESSAGE_EVENT: (%s)', JSON.stringify(payloads));
      this._emitBuildMessageEvent(senderId, payloads);
    });
  }

  _listenMessageShipperEvent() {
    this.messageProducer.on(FINISHED_BUILD_MESSAGE, messageStructure => {
      logger.info('Dispatcher: FINISHED_BUILD_MESSAGE: (%s)', JSON.stringify(messageStructure));

      this.messageShipper.emit(SHIPPING_MESSAGE_EVENT, messageStructure);
      this.messageTracker.emit(TRACK_OUT_GOING_MESSAGE_EVENT, messageStructure);
    });

    this.conversationProducer.on(FINISHED_BUILD_MESSAGE, messageStructure => {
      logger.info('Dispatcher: FINISHED_BUILD_MESSAGE: (%s)', JSON.stringify(messageStructure));

      this.messageShipper.emit(SHIPPING_MESSAGE_EVENT, messageStructure);
    });

    this.messageShipper.on(FINISHED_SHIPPING_MESSAGE_EVENT, messageStructure => {
      logger.info('Dispatcher: FINISHED_SHIPPING_MESSAGE_EVENT: (%s)', JSON.stringify(messageStructure));
      logger.info('Dispatcher: FINISHED_SHIPPING_MESSAGE_EVENT:  ------------------------');
    });
  }

  _emitBuildMessageEvent(senderId, payloads) {
    const self = this;
    return co(function *() {
      const user = yield self._bindSenderToCurrentUser(senderId);
      if (user) {
        if (payloads.length > 0 && !payloads.includes('CONVERSATION_PAYLOAD')) {
          user.chatting = false;
        } else {
          user.chatting = true;
        };

        if (user.chatting) {
          return self.conversationProducer.emit(BUILD_CONVERSATION_MESSAGE, user, payloads);
        } else {
          return self.messageProducer.emit(BUILD_MESSAGE_EVENT, user, payloads);
        }
      }
    });
  }

  _bindSenderToCurrentUser(senderId) {
    return co(function *() {
      return yield User.findOrCreateById(senderId);
    });
  }
}

