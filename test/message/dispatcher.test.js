import { expect } from 'chai';
import sinon from 'sinon';

import Dispatcher from 'message/dispatcher';
import { MessageProducerFactory } from 'message/producer';
import { MessageClassifierFactory } from 'message/classifier';
import { MessageShipperFactory } from 'message/shipper';

describe('Dispatcher', () => {
  const messageClassifier = new MessageClassifierFactory().build();
  const messageProducer = new MessageProducerFactory().build();
  const messageShipper = new MessageShipperFactory().build();
  const dispatcher = new Dispatcher(messageClassifier, messageProducer, messageShipper);

  context('#RECEIVED_MESSAGE_EVENT with valid event', () => {
    const validMessageEvent = {
      sender: {
        id: '1'
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
      const spy = sinon.spy(messageProducer, 'emit');
      messageClassifier.emit('FINISHED_HANDLE_MESSAGE_EVENT');
      expect(spy.calledOnce).to.be.true;
      messageProducer.emit.restore();
    });
  });

  context('#FINISHED_BUILD_MESSAGE', () => {
    it('emits to message producer ', () => {
      const spy = sinon.spy(messageShipper, 'emit');
      messageProducer.emit('FINISHED_BUILD_MESSAGE');
      expect(spy.calledOnce).to.be.true;
      messageShipper.emit.restore();
    });
  });
});
