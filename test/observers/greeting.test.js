import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach, afterEach } from 'mocha';

import services from 'services';
import { User } from 'models';
import GreetingListener from 'observers/validate-listeners/greeting';

describe('greeting observer', () => {
  let greetingListener;

  beforeEach(() => {
    greetingListener = new GreetingListener();
  });

  context('#shouldHandle', () => {
    it('returns false if messageEvent is null', (done) => {
      greetingListener._shouldHandle(null).then(result => {
        expect(result).to.be.false;
        done();
      });
    });

    it('returns false if messageEvent.message is null', (done) => {
      greetingListener._shouldHandle({}).then(result => {
        expect(result).to.be.false;
        done();
      });
    });

    it('returns false if messageEvent.message.text is null', (done) => {
      greetingListener._shouldHandle({ message: {} }).then(result => {
        expect(result).to.be.false;
        done();
      });
    });

    it('returns true if messageEvent.message.text is a greeting', (done) => {
      greetingListener._shouldHandle({ message: { text: 'xin chao' } }).then(result => {
        expect(result).to.be.true;
        done();
      });
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      sinon.stub(services, 'sendTextWithButtons', () => Promise.resolve('Success'));
      sinon.stub(User, 'findOrCreateById', () => Promise.resolve({ userId: '1' }));
      spy = sinon.spy(greetingListener, '_buildResponseMessage');
    });

    afterEach(() => {
      services.sendTextWithButtons.restore();
      User.findOrCreateById.restore();
    });

    it('send text message to user', (done) => {
      greetingListener._handle({ sender: { id: '1' } }).then((response) => {
        expect(spy.called).to.be.true;
        expect(response).to.be.equal('Success');
        done();
      });
    });
  });
});
