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
    it('does nothing if messageEvent is null', () => {
      let spy = sinon.spy(greetingListener, '_buildResponseMessage');
      greetingListener._handle(null);
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender is null', () => {
      let spy = sinon.spy(greetingListener, '_buildResponseMessage');
      greetingListener._handle({});
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender.id is null', () => {
      let spy = sinon.spy(greetingListener, '_buildResponseMessage');
      greetingListener._handle({ sender: {} });
      expect(spy.called).to.be.false;
    });

    it('send text message to user', () => {
      sinon.stub(services, 'sendTextMessage').returns(Promise.resolve('Success'));
      greetingListener._handle({ sender: { id: '1' } }).then(result => {
        expect(result).to.be.equal('Success');
      });
    });
  });
});
