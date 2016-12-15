import EventEmitter from 'events';

import { isTextMessasge, isQuickReplyMessage, isAttachmentMessage, isPostbackmessage } from 'utils/message-utils';
import { CLASSIFY_MESSAGE_EVENT, HANDLE_MESSAGE_EVENT, BUILD_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageClassifier extends EventEmitter {
  constructor(textMessageHandler, quickReplyMessageHandler, attachmentMessageHandler, postbackMessageHandler) {
    super();
    this.textMessageHandler = textMessageHandler;
    this.quickReplyMessageHandler = quickReplyMessageHandler;
    this.attachmentMessageHandler = attachmentMessageHandler;
    this.postbackMessageHandler = postbackMessageHandler;

    this._emitMessageToHandlers();
    this._listenHandlersEvent();
    this._emitEventToDispatcher();
  }

  _emitMessageToHandlers() {
    this.on(CLASSIFY_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Classifier: CLASSIFY_MESSAGE_EVENT: (%s)', JSON.stringify(messageEvent));

      if (isTextMessasge(messageEvent)) {
        this.textMessageHandler.emit(HANDLE_MESSAGE_EVENT, this, messageEvent);

      } else if (isQuickReplyMessage(messageEvent)) {
        this.quickReplyMessageHandler.emit(HANDLE_MESSAGE_EVENT, messageEvent);

      } if (isAttachmentMessage(messageEvent)) {
        this.attachmentMessageHandler.emit(HANDLE_MESSAGE_EVENT, messageEvent);

      } if (isPostbackmessage(messageEvent)) {
        this.postbackMessageHandler.emit(HANDLE_MESSAGE_EVENT, this, messageEvent);
      }
    });
  }

  _listenHandlersEvent() {
    this.textMessageHandler.on(FINISHED_HANDLE_MESSAGE_EVENT, payloads => {
      this.emit(FINISHED_HANDLE_MESSAGE_EVENT, payloads);
    });

    this.quickReplyMessageHandler.on(FINISHED_HANDLE_MESSAGE_EVENT, payloads => {
      this.emit(FINISHED_HANDLE_MESSAGE_EVENT, payloads);
    });

    this.attachmentMessageHandler.on(FINISHED_HANDLE_MESSAGE_EVENT, payloads => {
      this.emit(FINISHED_HANDLE_MESSAGE_EVENT, payloads);
    });

    this.postbackMessageHandler.on(FINISHED_HANDLE_MESSAGE_EVENT, payloads => {
      this.emit(FINISHED_HANDLE_MESSAGE_EVENT, payloads);
    });
  }

  _emitEventToDispatcher() {
    this.on(FINISHED_HANDLE_MESSAGE_EVENT, (payloads => {
      logger.info('Classifier: FINISHED_HANDLE_MESSAGE_EVENT: (%s)', JSON.stringify(payloads));
      this.emit(BUILD_MESSAGE_EVENT, payloads);
    }));
  }
}
