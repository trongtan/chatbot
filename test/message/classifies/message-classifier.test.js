import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach } from 'mocha';

import MessageClassifier from 'message/classifier/message-classifier';
import {
  TextMessageHandler,
  QuickReplyMessageHandler,
  AttachmentMessageHandler,
  PostbackMessageHandler } from 'message/classifier/handler';


describe('MessageClassifier', () => {
  let messageClassifier;
  let textMessageHandler;
  let quickReplyMessageHandler;
  let attachmentMessageHandler;
  let postbackMessageHandler;

  beforeEach(() => {
    textMessageHandler = new TextMessageHandler();
    quickReplyMessageHandler = new QuickReplyMessageHandler();
    attachmentMessageHandler = new AttachmentMessageHandler();
    postbackMessageHandler = new PostbackMessageHandler();

    messageClassifier = new MessageClassifier(textMessageHandler, quickReplyMessageHandler, attachmentMessageHandler, postbackMessageHandler);
  });

  context('#CLASSIFY_MESSAGE_EVENT', () => {
    it('emits the textMessageHandler when message is text', () => {
      const textMessageEvent = { message: { text: 'hey' } };
      const spy = sinon.spy(textMessageHandler, 'emit');

      messageClassifier.emit('CLASSIFY_MESSAGE_EVENT', textMessageEvent);
      expect(spy.calledWith('HANDLE_MESSAGE_EVENT', messageClassifier, textMessageEvent)).to.be.true;

      textMessageHandler.emit.restore();
    });

    it('emits the quickReplyMessageHandler when message is quick reply', () => {
      const textMessageEvent = { message: { text: 'hey', quick_reply: [] } };
      const spy = sinon.spy(quickReplyMessageHandler, 'emit');

      messageClassifier.emit('CLASSIFY_MESSAGE_EVENT', textMessageEvent);
      expect(spy.calledWith('HANDLE_MESSAGE_EVENT', textMessageEvent)).to.be.true;

      quickReplyMessageHandler.emit.restore();
    });

    it('emits the attachmentMessageHandler when message is attachment', () => {
      const textMessageEvent = { message: { text: 'hey', attachments: [] } };
      const spy = sinon.spy(attachmentMessageHandler, 'emit');

      messageClassifier.emit('CLASSIFY_MESSAGE_EVENT', textMessageEvent);
      expect(spy.calledWith('HANDLE_MESSAGE_EVENT', textMessageEvent)).to.be.true;

      attachmentMessageHandler.emit.restore();
    });

    it('emits the postbackMessageHandler when message is postback', () => {
      const textMessageEvent = { sender: { id: '1' }, postback: { payload: 'GREETING' } };
      const spy = sinon.spy(postbackMessageHandler, 'emit');

      messageClassifier.emit('CLASSIFY_MESSAGE_EVENT', textMessageEvent);
      expect(spy.calledWith('HANDLE_MESSAGE_EVENT', messageClassifier, textMessageEvent)).to.be.true;

      postbackMessageHandler.emit.restore();
    });
  });
});
