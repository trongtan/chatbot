import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import { MessageProducerFactory } from 'message/producer';

describe('MessageProducer', () => {
  let messageProducer;
  const senderId = '1';
  const messageBuilt = {
    'recipient': {
      'id': "USER_ID"
    },
    'message': {
      'text': 'hello from LifePedia'
    }
  };

  beforeEach(() => {
    messageProducer = new MessageProducerFactory().build();
  });

  context('events', () => {
    it('handles BUILD_MESSAGE_EVENT', () => {
      const spy = sinon.spy(messageProducer, '_buildMessageFromPayloads');
      messageProducer.emit('BUILD_MESSAGE_EVENT', senderId, ['GREETING_PAYLOAD']);
      expect(spy.calledOnce).to.be.true;
    });

    it('emits FINISHED_BUILD_MESSAGE to dispatcher when message template finish build message', () => {
      const spy = sinon.spy(messageProducer, 'emit');
      messageProducer.messageTemplate.emit('FINISHED_BUILD_MESSAGE', messageBuilt);
      expect(spy.calledWith('FINISHED_BUILD_MESSAGE', messageBuilt)).to.be.true;
    });
  });

  context('_buildMessageFromPayloads', () => {
    context('the requesting payload is text message', () => {
      const payloads = ['GREETING_PAYLOAD'];

      it('emits BUILD_TEXT_MESSAGE to messageTemplate', (done) => {
        const spy = sinon.spy(messageProducer.messageTemplate, 'emit');
        messageProducer._buildMessageFromPayloads(senderId, payloads).then(() => {
          expect(spy.called).to.be.true;
          expect(spy.args[0][0]).to.be.equal('BUILD_TEXT_MESSAGE');
          done();
        });
      });
    });

    context('the requesting payload is element message', () => {
      const payloads = ['MENU_PAYLOAD'];

      it('emits BUILD_GENERIC_MESSAGE to messageTemplate', (done) => {
        const spy = sinon.spy(messageProducer.messageTemplate, 'emit');
        messageProducer._buildMessageFromPayloads(senderId, payloads).then(() => {
          expect(spy.called).to.be.true;
          expect(spy.args[0][0]).to.be.equal('BUILD_GENERIC_MESSAGE');
          done();
        });
      });
    });

    context('the requesting payload is button message', () => {
      const payloads = ['UNSUPPORTED_PAYLOAD'];

      it('emits BUILD_BUTTON_TEMPLATE_MESSAGE to messageTemplate', (done) => {
        const spy = sinon.spy(messageProducer.messageTemplate, 'emit');
        messageProducer._buildMessageFromPayloads(senderId, payloads).then(() => {
          expect(spy.called).to.be.true;
          expect(spy.args[0][0]).to.be.equal('BUILD_BUTTON_TEMPLATE_MESSAGE');
          done();
        });
      });
    });

    context('the requesting payload is button message', () => {
      const payloads = ['REQUEST_INFORMATION_PAYLOAD', 'DISEASE_COLDS_PAYLOAD'];

      it('emits BUILD_DISEASE_TEMPLATE_MESSAGE to messageTemplate', (done) => {
        const spy = sinon.spy(messageProducer.messageTemplate, 'emit');
        messageProducer._buildMessageFromPayloads(senderId, payloads).then(() => {
          expect(spy.called).to.be.true;
          expect(spy.args[0][0]).to.be.equal('BUILD_DISEASE_TEMPLATE_MESSAGE');
          done();
        });
      });
    });
  });
});

