import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach, afterEach } from 'mocha';

import Dispatcher from 'message/dispatcher';
import { MessageProducerFactory } from 'message/producer';
import { MessageClassifierFactory } from 'message/classifier';
import { MessageShipperFactory } from 'message/shipper';
import MessageTracker from 'message/tracker/message-tracker';
import Utils from 'utils';

describe('Dispatcher', () => {
  const messageClassifier = new MessageClassifierFactory().build();
  const messageProducer = new MessageProducerFactory().build();
  const messageShipper = new MessageShipperFactory().build();
  const messageTracker = new MessageTracker();
  const dispatcher = new Dispatcher(messageClassifier, messageProducer, messageShipper, messageTracker);

  context('#RECEIVED_MESSAGE_EVENT with valid event', () => {
    const validMessageEvent = {
      sender: {
        id: '1'
      },
      message: {
        text: 'text'
      }
    };

    it('emits to message classifier ', () => {
      const spy = sinon.spy(messageClassifier, 'emit');
      dispatcher.emit('RECEIVED_MESSAGE_EVENT', validMessageEvent);
      expect(spy.calledOnce).to.be.true;
      messageClassifier.emit.restore();
    });
  });

  context('#RECEIVED_MESSAGE_EVENT with invalid event', () => {
    const invalidMessageEvent = {};

    it('emits to message classifier ', () => {
      const spy = sinon.spy(messageClassifier, 'emit');
      dispatcher.emit('RECEIVED_MESSAGE_EVENT', invalidMessageEvent);
      sinon.assert.notCalled(spy);
      messageClassifier.emit.restore();
    });
  });

  context('#FINISHED_HANDLE_MESSAGE_EVENT', () => {
    it('emits to message producer ', () => {
      const spy = sinon.spy(dispatcher, '_emitBuildMessageEvent');
      messageClassifier.emit('FINISHED_HANDLE_MESSAGE_EVENT');
      expect(spy.calledOnce).to.be.true;
      dispatcher._emitBuildMessageEvent.restore();
    });
  });

  context('#FINISHED_BUILD_MESSAGE', () => {
    const validMessageEvent = {
      recipient: {
        id: '1'
      },
      message: {
        text: 'text'
      }
    };

    beforeEach(() => {
      sinon.stub(Utils, 'callSendAPI', () => Promise.resolve(true));
    });

    it('emits to message shipper ', () => {
      const spy = sinon.spy(messageShipper, 'emit');
      messageProducer.emit('FINISHED_BUILD_MESSAGE', validMessageEvent);
      expect(spy.calledOnce).to.be.true;
      messageShipper.emit.restore();
      Utils.callSendAPI.restore();
    });

    it('emits to message tracker ', () => {
      const spy = sinon.spy(messageTracker, 'emit');
      messageProducer.emit('FINISHED_BUILD_MESSAGE', validMessageEvent);
      expect(spy.calledOnce).to.be.false;
      messageTracker.emit.restore();
      Utils.callSendAPI.restore();
    });
  });

  context('#emitBuildMessageEvent', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(messageProducer, 'emit');
    });

    afterEach(() => {
      messageProducer.emit.restore();
      dispatcher._bindSenderToCurrentUser.restore();
    });

    context('senderId is valid on facebook', () => {
      beforeEach(() => {
        sinon.stub(dispatcher, '_bindSenderToCurrentUser', () => Promise.resolve({ userId: 'userId' }));
      });

      it('emits to message producer ', (done) => {
        dispatcher._emitBuildMessageEvent('userId', 'GREETING_PAYLOAD').then(() => {
          expect(spy.calledOnce).to.be.true;
          done();
        });
      });
    });

    context('senderId is not valid on facebook', () => {
      beforeEach(() => {
        sinon.stub(dispatcher, '_bindSenderToCurrentUser', () => Promise.resolve(null));
      });

      it('does not emit to message producer ', (done) => {
        dispatcher._emitBuildMessageEvent('userId', 'GREETING_PAYLOAD').then(() => {
          expect(spy.calledOnce).to.be.false;
          done();
        });
      });
    });
  });
});
