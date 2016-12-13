import sinon from 'sinon';

import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskCustomMessageListener from 'observers/analyze-listeners/ask-custom-message';

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

  context('#validateMessageAndUserState', () => {
    it('returns false if message is null', () => {
      askCustomMessageListener._validateMessageAndUserState(null, null).then((response) => {
        expect(response).to.containSubset({ shouldHandle: false });
      });
    });

    it('returns true if message text match with keyword', () => {
      askCustomMessageListener._validateMessageAndUserState('bs oi', null).then((response) => {
        expect(response).to.containSubset({ shouldHandle: true });
      });
    });

    it('returns false if message text does not match', () => {
      askCustomMessageListener._validateMessageAndUserState('unmatched keyword', null).then((response) => {
        expect(response).to.containSubset({ shouldHandle: true });
      });
    });
  });

  context('#execute', () => {
    it('sends response to user', (done) => {
      sinon.stub(askCustomMessageListener, '_sendResponseMessage', () => Promise.resolve('Success'));
      sinon.stub(askCustomMessageListener, '_getOutputPayload', () => Promise.resolve('CUSTOM_PAYLOAD'));

      askCustomMessageListener._execute({ user: { userId: '1' } }).then((response) => {
        expect(response).to.be.equal('Success');
        done();
      });
    });
  });

  context('#messageTextMatchedWithKeyword', () => {
    context('the message text match with keyword', () => {
      beforeEach(() => {
        askCustomMessageListener.messageText = 'bs oi';
      });

      it('returns true', (done) => {
        askCustomMessageListener._messageTextMatchedWithKeyword().then( result => {
          expect(result).to.be.true;
          done();
        });
      });
    });

    context('the message text does not match with keyword', () => {
      beforeEach(() => {
        askCustomMessageListener.messageText = 'unmatched message';
      });

      it('returns false', (done) => {
        askCustomMessageListener._messageTextMatchedWithKeyword().then( result => {
          expect(result).to.be.false;
          done();
        });
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
