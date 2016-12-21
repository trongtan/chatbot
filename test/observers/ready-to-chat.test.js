import Promise from 'promise';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { beforeEach } from 'mocha';
import chaiSubset from 'chai-subset';

import services from 'services';
import ReadyToChatListener from 'observers/analyze-listeners/ready-to-chat';
import { payloadConstants } from 'utils/constants';
import { User } from 'models';

chai.use(chaiSubset);

describe('ready to chat observer', () => {
  let readyToChatListener;

  beforeEach(() => {
    readyToChatListener = new ReadyToChatListener();
  });

  context('#analyze', () => {
    context('current payload is not GET_STARTED_PAYLOAD', () => {
      it('returns false if messageEvent is null', (done) => {
        readyToChatListener._analyze(null).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message is null', (done) => {
        readyToChatListener._analyze({}).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply is null', (done) => {
        readyToChatListener._analyze({ message: {} }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is null', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: {} } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is neither READY_TO_CHAT_PAYLOAD nor NOT_READY_TO_CHAT_PAYLOAD', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: { payload: 'invalid_payload' } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender is null', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender.id is null', (done) => {
        readyToChatListener._analyze({
          message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } },
          sender: {}
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });
    });

    context('validate', () => {
      it('calls validate method', (done) => {
        sinon.stub(readyToChatListener, '_validate', () => Promise.resolve('Success'));

        readyToChatListener._analyze({
          message: { text: 'co' },
          sender: { id: '1' },
        }).then(response => {
          expect(response).to.be.equal('Success');
          done();
        });
      });

      it('doesn\'t call validate method if text is invalid', (done) => {
        sinon.stub(User, 'findOrCreateById', () => Promise.resolve({ shouldHandle: false }));

        readyToChatListener._analyze({
          message: { text: 'text' },
          sender: { id: '1' },
        }).then(response => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
        }).done(() => {
          User.findOrCreateById.restore();
          done();
        });
      });
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(readyToChatListener, '_sendResponseMessage');
    });

    it('does nothing if shouldHandle is false', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it('does nothing if payload is neither READY_TO_CHAT_PAYLOAD nor NOT_READY_TO_CHAT_PAYLOAD', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    context('valid', () => {
      let user = {
        userId: '1',
        currentPayload: payloadConstants.GET_STARTED_PAYLOAD
      };

      beforeEach((done) => {
        sinon.stub(services, 'sendTextWithQuickReplyMessage', () => Promise.resolve('Success'));
        sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));

        User.sync({ force: true }).then(() => {
          return User.create(user).then(() => {
            done();
          });
        });
      });

      afterEach(() => {
        services.sendTextWithQuickReplyMessage.restore();
        services.sendTextMessage.restore();
      });
    });
  });

  context('#validate', () => {
    let user = {
      userId: '1',
      firstName: 'First',
      lastName: 'Last',
      gender: 'Male',
      currentPayload: payloadConstants.GET_STARTED_PAYLOAD
    };

    beforeEach((done) => {
      User.sync({ force: true }).then(function () {
        return User.create(user);
      }).then(() => {
        done();
      });
    });

    it('returns true if current payload is GET_STARTED_PAYLOAD', (done) => {
      readyToChatListener._validate('co', '1').then((response) => {
        expect(response).to.containSubset({
          shouldHandle: true,
          payload: payloadConstants.READY_TO_CHAT_PAYLOAD
        });
        expect(response.user).to.containSubset(user);
        done();
      });
    });

    it('returns true if current payload is GET_STARTED_PAYLOAD', (done) => {
      readyToChatListener._validate('ko', '1').then((response) => {
        expect(response).to.containSubset({
          shouldHandle: true,
          payload: payloadConstants.NOT_READY_TO_CHAT_PAYLOAD
        });
        expect(response.user).to.containSubset(user);
        done();
      });
    });
  });
});
