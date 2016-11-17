import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import services from 'services';
import GreetingListener from 'observers/greeting';

describe('greeting observer', () => {
  let greetingListener;

  beforeEach(() => {
    greetingListener = new GreetingListener();
  });

  context('#shouldHandle', () => {
    it('returns false if messageEvent is null', () => {
      expect(greetingListener._shouldHandle(null)).to.be.false;
    });

    it('returns false if messageEvent.message is null', () => {
      expect(greetingListener._shouldHandle({})).to.be.false;
    });

    it('returns false if messageEvent.message.text is null', () => {
      expect(greetingListener._shouldHandle({ message: {} })).to.be.false;
    });

    it('returns true if messageEvent.message.text is a greeting', () => {
      expect(greetingListener._shouldHandle({ message: { text: 'xin chao' } })).to.be.true;
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(greetingListener, '_buildResponseMessage');
    });

    it('does nothing if messageEvent is null', () => {
      greetingListener._handle(null);
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender is null', () => {
      greetingListener._handle({});
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender.id is null', () => {
      greetingListener._handle({ sender: {} });
      expect(spy.called).to.be.false;
    });

    it('send text message to user', (done) => {
      sinon.stub(services, 'sendTextWithQuickReplyMessage', () => Promise.resolve('Success'));
      greetingListener._handle({ sender: { id: '1' } }).then((response) => {
        expect(spy.called).to.be.true;
        expect(response).to.be.equal('Success');
      }).done(() => {
        services.sendTextWithQuickReplyMessage.restore();
        done();
      });
    });
  });
});
