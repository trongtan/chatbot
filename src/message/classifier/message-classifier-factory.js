import MessageClassifier from './message-classifier';
import {
  TextMessageHandler,
  QuickReplyMessageHandler,
  AttachmentMessageHandler,
  PostbackMessageHandler } from './handler';

export default class MessageDispatcherFactory {
  build() {
    const textMessageHandler = new TextMessageHandler();
    const quickReplyMessageHandler = new QuickReplyMessageHandler();
    const attachmentMessageHandler = new AttachmentMessageHandler();
    const postbackMessageHandler = new PostbackMessageHandler();

    return new MessageClassifier(textMessageHandler, quickReplyMessageHandler, attachmentMessageHandler, postbackMessageHandler);
  }
}
