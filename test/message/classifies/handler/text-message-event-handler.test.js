import Promise from 'promise';

import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach } from 'mocha';

import { TextMessageHandler } from 'message/classifier/handler';

describe('TextMessageHandler', () => {
  let messageHandler;
  const validMessageEvent = {
    sender: {
      id: '1'
    },
    message: {
      text: 'hey'
    }
  };

  beforeEach(() => {
    messageHandler = new TextMessageHandler();
  });

  context('constructor', () => {
    it('handles message on HANDLE_MESSAGE_EVENT emitted', () => {
      const spy = sinon.spy(messageHandler, 'findPostbackAndEmitEvent');
      messageHandler.emit('HANDLE_MESSAGE_EVENT', null, validMessageEvent);
      expect(spy.calledOnce).to.be.true;

      messageHandler.findPostbackAndEmitEvent.restore();
    });
  });

  context('#findPostbackAndEmitEvent', () => {
    beforeEach(() => {
      sinon.stub(messageHandler, '_findPostbackInMessageEvent', () => Promise.resolve(['GREETING_PAYLOAD']));
    });

    it('emits FINISHED_HANDLE_MESSAGE_EVENT when payload found', (done) => {
      const spy = sinon.spy(messageHandler, 'emit');

      messageHandler.findPostbackAndEmitEvent(validMessageEvent).then(() => {
        expect(spy.calledWith('FINISHED_HANDLE_MESSAGE_EVENT', '1', ['GREETING_PAYLOAD'])).to.be.true;

        messageHandler._findPostbackInMessageEvent.restore();
        messageHandler.emit.restore();
        done();
      });
    });
  });
});
