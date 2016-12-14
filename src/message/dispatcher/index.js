import EventEmitter from 'events';

import { isTextMessasge, isQuickReplyMessage, isAttachmentMessage, isPostbackmessage } from 'utils/message-utils';
import { DISPATCH_MESSAGE_EVENT, HANDLE_MESSAGE_EVENT, BUILD_MESSAGE_EVENT, FINISHED_HANDLE_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

import {
  TextMessageHandler,
  QuickReplyMessageHandler,
  AttachmentMessageHandler,
  PostbackMessageHandler } from './handler';

export default class MessageDispatcher extends EventEmitter {
  constructor(dispatcher) {
    super();
    this.dispatcher = dispatcher;

    this._dispatchIncomingMessageToHandlers();
    this._dispatchOutcomingMessasge();
  }

  _dispatchIncomingMessageToHandlers() {
    this.on(DISPATCH_MESSAGE_EVENT, (messageEvent) => {
      logger.info('Dispatcher: Dispatch Message Event: (%s)', JSON.stringify(messageEvent));

      if (isTextMessasge(messageEvent)) {
        const textMessageHandler = new TextMessageHandler();
        textMessageHandler.emit(HANDLE_MESSAGE_EVENT, this, messageEvent);

      } else if (isQuickReplyMessage(messageEvent)) {
        const quickReplyMessageHandler = new QuickReplyMessageHandler();
        quickReplyMessageHandler.emit(HANDLE_MESSAGE_EVENT, messageEvent);

      } if (isAttachmentMessage(messageEvent)) {
        const attachmentMessageHandler = new AttachmentMessageHandler();
        attachmentMessageHandler.emit(HANDLE_MESSAGE_EVENT, messageEvent);

      } if (isPostbackmessage(messageEvent)) {
        const postbackMessageHandler = new PostbackMessageHandler();
        postbackMessageHandler.emit(HANDLE_MESSAGE_EVENT, this, messageEvent);
      }
    });
  }

  _dispatchOutcomingMessasge() {
    this.on(FINISHED_HANDLE_MESSAGE_EVENT, (payloads => {
      this.dispatcher.emit(BUILD_MESSAGE_EVENT, payloads);
    }));
  }
}
