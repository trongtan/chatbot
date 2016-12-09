import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskCustomMessageListener from 'observers/validate-listeners/ask-custom-message';

describe('ask guide observer', () => {
  let askCustomMessageListener;

  beforeEach(() => {
    askCustomMessageListener = new AskCustomMessageListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askCustomMessageListener.tag).to.be.equal('[Ask Custom Message]');
    });
  });

  context('#isIntentionalMessage', () => {
    it('always returns true', (done) => {
      askCustomMessageListener._isIntentionalMessage().then((result) => {
        expect(result).to.be.true;
        done();
      });
    });
  });

  context('#getOutputPayload', () => {
    context('the message text match with keyword', () => {
      beforeEach(() => {
        askCustomMessageListener.messageText = 'bs oi';
      });

      it('returns group name', (done) => {
        askCustomMessageListener._getOutputPayload().then(result => {
          expect(result).to.be.equal('GREETING_PAYLOAD');
          done();
        });
      });
    });

    context('the message text does not match with keyword', () => {
      beforeEach(() => {
        askCustomMessageListener.messageText = 'unmatched message';
      });

      it('returns UNSUPPORTED_PAYLOAD', (done) => {
        askCustomMessageListener._getOutputPayload().then(result => {
          expect(result).to.be.equal('UNSUPPORTED_PAYLOAD');
          done();
        });
      });
    });
  });
});
