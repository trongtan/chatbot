import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import services from 'services';
import AskIsParentListener from 'observers/ask-is-parent';
import { payloadConstants, parentalConstants } from 'utils/constants';
import { User } from 'models';

describe('ask is parent observer', () => {
  let askIsParentListener;

  beforeEach(() => {
    askIsParentListener = new AskIsParentListener();
  });

  context('#analyze', () => {
    context('current payload is not READY_TO_CHAT_PAYLOAD', () => {
      it('returns false if messageEvent is null', (done) => {
        askIsParentListener._analyze(null).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message is null', (done) => {
        askIsParentListener._analyze({}).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply is null', (done) => {
        askIsParentListener._analyze({ message: {} }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is null', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: {} } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is neither IS_DAD_PAYLOAD nor IS_MOM_PAYLOAD nor NO_CHILDREN_PAYLOAD', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: { payload: 'invalid_payload' } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender is null', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender.id is null', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } },
          sender: {}
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is IS_DAD_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.IS_DAD_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_DAD_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is IS_MOM_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.IS_MOM_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_MOM_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is NO_CHILDREN_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.NO_CHILDREN_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.NO_CHILDREN_PAYLOAD
          }));
          done();
        });
      });
    });

    context('validate message and current payload', () => {
      it('calls validateMessageAndCurrentPayload method', (done) => {
        sinon.stub(askIsParentListener, '_validateMessageAndCurrentPayload', () => Promise.resolve('Success'));

        askIsParentListener._analyze({
          message: { text: 'bo' },
          sender: { id: '1' },
        }).then(response => {
          expect(response).to.be.equal('Success');
          done();
        });
      });

      it('doesn\'t call validateMessageAndCurrentPayload method if text is invalid', (done) => {
        askIsParentListener._analyze({
          message: { text: 'text' },
          sender: { id: '1' },
        }).then(response => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.stub(askIsParentListener, '_buildResponseMessage', () => Promise.resolve('Success'));
    });
    it('does nothing if shouldHandle is false', (done) => {
      askIsParentListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it('send message if payload is IS_DAD_PAYLOAD', (done) => {
      sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));

      askIsParentListener._handle(null, {
        shouldHandle: true,
        payload: payloadConstants.IS_DAD_PAYLOAD,
        userId: '1'
      }).then((response) => {
        expect(response).to.be.equal('Success');
      }).done(() => {
        services.sendTextMessage.restore();
        done();
      });
    });
  });

  context('#validateMessageAndCurrentPayload', () => {
    context('database not ready', () => {
      it('return false', (done) => {
        askIsParentListener._validateMessageAndCurrentPayload('bo', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });
    });

    context('database ready', () => {
      beforeEach((done) => {
        User.sync({ force: true }).then(function () {
          return User.create({
            userId: '1',
            firstName: 'First',
            lastName: 'Last',
            gender: 'Male',
            currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
          });
        }).then(() => {
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validateMessageAndCurrentPayload('bo', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: parentalConstants.DAD
          }));
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validateMessageAndCurrentPayload('me', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: parentalConstants.MOM
          }));
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validateMessageAndCurrentPayload('chua co con', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: parentalConstants.NA
          }));
          done();
        });
      });
    });
  });

  context('#buildResponseMessage', () => {
    it('builds message contains user name', (done) => {
      User.sync({ force: true }).then(function () {
        return User.create({
          userId: '1',
          firstName: 'First',
          lastName: 'Last',
          gender: 'Male',
          currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
        });
      }).then(() => {
        askIsParentListener._buildResponseMessage('1', parentalConstants.DAD).then((response) => {
          expect(response).to.contain('First');
          expect(response).to.contain('Last');
          done();
        });
      });
    });

    it('builds message contains user name', (done) => {
      User.sync({ force: true }).then(() => {
        askIsParentListener._buildResponseMessage('1', parentalConstants.DAD).then((response) => {
          expect(response).to.be.empty;
          done();
        });
      });
    });
  });

  context('#getParentalFromMessage', () => {
    it('returns parental base on input message', () => {
      expect(askIsParentListener._getParentalFromMessage('bo')).to.be.equal(parentalConstants.DAD);
      expect(askIsParentListener._getParentalFromMessage('me')).to.be.equal(parentalConstants.MOM);
      expect(askIsParentListener._getParentalFromMessage('chua co con')).to.be.equal(parentalConstants.NA);
    });
  });
});
